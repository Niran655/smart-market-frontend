import { useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Bot, Brain, LineChart, Send, ShoppingCart, Sparkles, Warehouse } from "lucide-react";

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutation";


const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
const GEMINI_FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"];

const quickQuestions = [
  {
    label: "Sales today",
    icon: <ShoppingCart size={16} />,
    prompt: "Do you want to know about selling today? Summarize today's orders, revenue, top products, and risk.",
  },
  {
    label: "Low stock",
    icon: <Warehouse size={16} />,
    prompt: "Analyze low stock and out of stock products. Tell me what needs action first.",
  },
  {
    label: "System flow",
    icon: <Brain size={16} />,
    prompt: "Explain how the whole Smart Market system works from queries, mutations, sales, stock, reports, and users.",
  },
  {
    label: "Business health",
    icon: <LineChart size={16} />,
    prompt: "Analyze the current business health and give practical next actions for the manager.",
  },
];

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

const getOperationSummary = (operationMap, type) =>
  Object.entries(operationMap).map(([exportName, document]) => {
    const definition = document?.definitions?.find((item) => item.kind === "OperationDefinition");
    return {
      exportName,
      type,
      operationName: definition?.name?.value || exportName,
      variables:
        definition?.variableDefinitions?.map((item) => ({
          name: item.variable?.name?.value,
          type: item.type?.name?.value || item.type?.type?.name?.value || "Input",
        })) || [],
    };
  });

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const unwrapGraphqlType = (type) => {
  if (!type) return { name: "Input", required: false };
  if (type.kind === "NonNullType") {
    const inner = unwrapGraphqlType(type.type);
    return { ...inner, required: true };
  }
  if (type.kind === "ListType") {
    const inner = unwrapGraphqlType(type.type);
    return { name: inner.name, list: true, required: false };
  }
  return { name: type.name?.value || "Input", required: false };
};

const getVariableDefinitions = (document) => {
  const definition = document?.definitions?.find((item) => item.kind === "OperationDefinition");
  return (
    definition?.variableDefinitions?.map((item) => ({
      name: item.variable?.name?.value,
      ...unwrapGraphqlType(item.type),
    })) || []
  );
};

const buildQueryVariables = (exportName, document, baseContext) => {
  const variableDefinitions = getVariableDefinitions(document);
  const variables = {};
  const missingRequired = [];

  for (const variable of variableDefinitions) {
    const name = variable.name;
    if (!name) continue;

    if (name === "page") variables[name] = 1;
    else if (name === "limit") variables[name] = 8;
    else if (name === "pagination") variables[name] = true;
    else if (name === "keyword") variables[name] = "";
    else if (name === "period") variables[name] = "1D";
    else if (name === "txType") variables[name] = "sale";
    else if (name === "filter") variables[name] = "today";
    else if (name === "type") variables[name] = "SALES";
    else if (name === "status") variables[name] = undefined;
    else if (name === "active") variables[name] = undefined;
    else if (name === "categoryId") variables[name] = undefined;
    else if (name === "daysThreshold") variables[name] = 30;
    else if (name === "year") variables[name] = new Date().getFullYear();
    else if (name === "startDate") variables[name] = baseContext.today.startDate;
    else if (name === "endDate") variables[name] = baseContext.today.endDate;
    else if (name === "dayStart") variables[name] = baseContext.today.startDate;
    else if (name === "dayEnd") variables[name] = baseContext.today.endDate;
    else if (name === "shopId") variables[name] = variable.list ? baseContext.shopIds : baseContext.shopId;
    else if (name === "shopIds") variables[name] = baseContext.shopId;
    else if (name === "userId") variables[name] = baseContext.userId;
    else if (name === "id" || name === "_id") variables[name] = resolveGenericId(exportName, baseContext);
    else if (name === "subProductId") variables[name] = undefined;
    else if (name === "parentProductId") variables[name] = undefined;
    else if (name === "supplierId") variables[name] = undefined;

    if (variable.required && (variables[name] === undefined || variables[name] === null || variables[name] === "")) {
      missingRequired.push(name);
    }
  }

  return { variables, missingRequired };
};

const resolveGenericId = (exportName, baseContext) => {
  if (exportName.includes("PROFILE")) return baseContext.userId;
  if (exportName.includes("SHOP") || exportName.includes("TABLE")) return baseContext.shopId;
  return undefined;
};

const isQueryDocument = (document) =>
  document?.definitions?.some(
    (definition) => definition.kind === "OperationDefinition" && definition.operation === "query"
  );

const compactJson = (value, limit = 9000) => JSON.stringify(value, null, 2).slice(0, limit);

const summarizeOperationsForPrompt = (operations) => ({
  queryCount: operations.queries.length,
  mutationCount: operations.mutations.length,
  mainQueries: operations.queries
    .filter((operation) =>
      [
        "DASHBOARD",
        "REPORT",
        "SALE",
        "PRODUCT",
        "STOCK",
        "WAREHOUSE",
        "CUSTOMER",
        "SUPPLIER",
        "PURCHASE",
        "SHIFT",
      ].some((keyword) => operation.exportName.includes(keyword))
    )
    .slice(0, 35),
  mainMutations: operations.mutations
    .filter((operation) =>
      [
        "CREATE",
        "UPDATE",
        "DELETE",
        "SALE",
        "STOCK",
        "WAREHOUSE",
        "PURCHASE",
        "SHIFT",
        "REFUND",
      ].some((keyword) => operation.exportName.includes(keyword))
    )
    .slice(0, 40),
});

const readGeminiText = (payload) =>
  payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim() || "I could not read a response from Gemini.";

const normalizeModelName = (model) => model.replace(/^models\//, "");

async function askGemini(prompt) {
  const modelsToTry = [
    normalizeModelName(GEMINI_MODEL),
    ...GEMINI_FALLBACK_MODELS.filter((model) => model !== normalizeModelName(GEMINI_MODEL)),
  ];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      return await askGeminiModel(prompt, model);
    } catch (error) {
      lastError = error;
      const canRetry =
        error.message?.includes("not found") ||
        error.message?.includes("not supported") ||
        error.message?.includes("quota") ||
        error.message?.includes("rate limit") ||
        error.status === 429 ||
        error.status === 404;
      if (!canRetry) break;
    }
  }

  throw lastError || new Error("Gemini request failed");
}

async function askGeminiModel(prompt, model) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a concise Smart Market business analyst. Use the provided data and GraphQL operation summary. If data is missing, say so briefly.",
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 900,
        },
      }),
    }
  );

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload?.error?.message || "Gemini request failed");
    error.status = response.status;
    throw error;
  }
  return readGeminiText(payload);
}

export default function ChatBot() {
  const theme = useTheme();
  const apolloClient = useApolloClient();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello. I can analyze sales, inventory, reports, customers, and the GraphQL requests that power this Smart Market system.",
    },
  ]);

  const operations = useMemo(
    () => ({
      queries: getOperationSummary(queries, "query"),
      mutations: getOperationSummary(mutations, "mutation"),
    }),
    []
  );

  const runSnapshotQueries = async () => {
    const shopId = localStorage.getItem("activeShopId") || undefined;
    const user = getStoredUser();
    const userId = user?._id || user?.id || undefined;
    const today = getTodayRange();
    const baseContext = {
      shopId,
      shopIds: shopId ? [shopId] : undefined,
      userId,
      today,
    };

    const runnableTasks = [];
    const skipped = {};

    for (const [name, query] of Object.entries(queries)) {
      if (!isQueryDocument(query)) continue;

      const { variables, missingRequired } = buildQueryVariables(name, query, baseContext);
      if (missingRequired.length) {
        skipped[name] = `Missing required variables: ${missingRequired.join(", ")}`;
        continue;
      }

      runnableTasks.push([name, query, variables]);
    }

    const results = await Promise.allSettled(
      runnableTasks.map(async ([name, query, variables]) => {
        const response = await apolloClient.query({
          query,
          variables,
          fetchPolicy: "network-only",
        });
        return { name, data: response.data };
      })
    );

    return results.reduce(
      (snapshot, result, index) => {
        const name = runnableTasks[index][0];
        if (result.status === "fulfilled") {
          snapshot[name] = result.value.data;
        } else {
          snapshot.errors[name] = result.reason?.message || "Failed to load";
        }
        return snapshot;
      },
      {
        shopId: shopId || null,
        userId: userId || null,
        generatedAt: new Date().toISOString(),
        queryAccess: {
          totalQueries: operations.queries.length,
          attemptedQueries: runnableTasks.length,
          skippedQueries: skipped,
        },
        errors: {},
      }
    );
  };

  const buildPrompt = (question, snapshot) => `
You are the Smart Market AI business analyst.

Answer the user's question using:
1. The live GraphQL data snapshot.
2. The list of all frontend GraphQL queries and mutations.
3. Smart retail/POS reasoning.

Be practical and concise. If data is missing, say what is missing and continue with what is available.
Use clear sections and give action items when useful.

User question:
${question}

Live data snapshot:
${compactJson(snapshot)}

GraphQL operation map:
${compactJson(summarizeOperationsForPrompt(operations), 7000)}
`;

  const sendMessage = async (messageText = input) => {
    const question = messageText.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Missing VITE_GEMINI_API_KEY in frontend/.env");
      }

      const snapshot = await runSnapshotQueries();
      const answer = await askGemini(buildPrompt(question, snapshot));
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I could not complete the AI analysis: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1180, mx: "auto", height: "calc(100vh - 120px)", minHeight: 620 }}>
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  display: "grid",
                  placeItems: "center",
                  color: theme.palette.primary.contrastText,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                <Bot size={24} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Smart Market AI Analyst
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Summarizes live reports, system queries, mutations, and store activity.
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${operations.queries.length} queries`} size="small" />
              <Chip label={`${operations.mutations.length} mutations`} size="small" />
              <Chip label={GEMINI_MODEL} size="small" color="primary" variant="outlined" />
            </Stack>
          </Stack>
        </Paper>

        {!GEMINI_API_KEY && (
          <Alert severity="warning">Add VITE_GEMINI_API_KEY to frontend/.env, then restart the Vite dev server.</Alert>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {quickQuestions.map((item) => (
            <Button
              key={item.label}
              variant="outlined"
              startIcon={item.icon}
              onClick={() => sendMessage(item.prompt)}
              disabled={loading}
              sx={{ borderRadius: 1 }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <Stack spacing={1.5}>
              {messages.map((message, index) => (
                <Box
                  key={`${message.role}-${index}`}
                  sx={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: { xs: "100%", md: "78%" },
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor:
                        message.role === "user"
                          ? theme.palette.primary.main
                          : theme.palette.action.hover,
                      color:
                        message.role === "user"
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      whiteSpace: "pre-wrap",
                      
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                  </Paper>
                </Box>
              ))}
              {loading && (
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <CircularProgress size={18} />
                  <Typography variant="body2">Collecting system data and asking Gemini...</Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider />
          <Box component="form" onSubmit={(event) => { event.preventDefault(); sendMessage(); }} sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                value={input}
                disabled={loading}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about sales today, low stock, reports, customers, or how the system works..."
                InputProps={{
                  startAdornment: <Sparkles size={18} style={{ marginRight: 8 }} />,
                }}
              />
              <IconButton type="submit" color="primary" disabled={loading || !input.trim()}>
                <Send size={20} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
