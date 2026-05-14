import { useMutation } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import { CREATE_USER, UPDATE_USER } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";
import { deleteImageFromStorage } from "../../utils/supabaseImageStorage";
import ReusableForm from "../include/useForm";

export default function UserForm({
  open,
  onClose,
  t,
  userData,
  dialogTitle,
  setRefetch,
}) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingImagePath, setPendingImagePath] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  const [formValues, setFormValues] = useState({
    nameKh: "",
    nameEn: "",
    image: "",
    phone: "",
    gender: "male",
    email: "",
    role: "admin",
    active: true,
    password: "",
  });
  const submittedValuesRef = useRef(formValues);

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: ({ createUser }) => {
      setLoading(false);
      if (createUser?.isSuccess) {
        setAlert(true, "success", createUser.message);
        setPendingImagePath(null);
        onClose();
        setRefetch();
      } else {
        if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
        setAlert(true, "error", createUser.message);
      }
    },
    onError: (err) => {
      setLoading(false);
      if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
      setAlert(true, "error", err.message);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: async ({ updateUser }) => {
      setLoading(false);
      if (updateUser?.isSuccess) {
        const submittedImage = submittedValuesRef.current?.image || "";
        if (oldImageUrl && oldImageUrl !== submittedImage) {
          await deleteImageFromStorage(oldImageUrl).catch(console.error);
        }
        setAlert(true, "success", updateUser.message);
        setPendingImagePath(null);
        setOldImageUrl(submittedImage);
        onClose();
        setRefetch();
      } else {
        if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
        setAlert(true, "error", updateUser.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      if (pendingImagePath) deleteImageFromStorage(pendingImagePath).catch(console.error);
      setAlert(true, "error", {
        messageEn: error.message,
        messageKh: error.message,
      });
    },
  });

  useEffect(() => {
    if (userData) {
      setFormValues({
        nameKh: userData.nameKh || "",
        nameEn: userData.nameEn || "",
        phone: userData.phone || "",
        email: userData.email || "",
        gender: userData.gender || "male",
        role: userData.role || "admin",
        image: userData.image || "",
        active: userData.active ?? true,
        password: "",
      });
      setOldImageUrl(userData.image || "");
      setPendingImagePath(null);
    }
  }, [userData]);

  const validationSchema = Yup.object({
    nameKh: Yup.string().required(t("require")),
    nameEn: Yup.string().required(t("require")),
    phone: Yup.string().required(t("require")),
    email: Yup.string().email().required(t("require")),
    gender: Yup.string().required(t("require")),
    role: Yup.string().required(t("require")),
    active: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    setLoading(true);
    submittedValuesRef.current = values;
    setFormValues(values);
    if (dialogTitle === "Create") {
      createUser({ variables: { input: values } });
    } else {
      updateUser({ variables: { id: userData._id, input: values } });
    }
  };

  const handleClose = async () => {
    if (pendingImagePath) {
      await deleteImageFromStorage(pendingImagePath).catch(console.error);
      setPendingImagePath(null);
    }
    onClose();
  };

  const handleUploadedPath = async (path) => {
    if (pendingImagePath && pendingImagePath !== path) {
      await deleteImageFromStorage(pendingImagePath).catch(console.error);
    }
    setPendingImagePath(path);
  };

  const tabs = [
    {
      fields: [
        { name: "image", label: t("image"), type: "image", grid: { xs: 12 }, setFilePath: handleUploadedPath },
        { name: "nameKh", label: t("khmer_name"), grid: { xs: 12, md: 6 } },
        { name: "nameEn", label: t("english_name"), grid: { xs: 12, md: 6 } },
        {
          name: "gender",
          label: t("gender"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            { label: t("male"), value: "male" },
            { label: t("female"), value: "female" },
          ],
        },
        { name: "phone", label: t("phone"), grid: { xs: 12, md: 6 } },
        { name: "email", label: t("email"), grid: { xs: 12, md: 6 } },
        {
          name: "role",
          label: t("role"),
          type: "select",
          grid: { xs: 12, md: 6 },
          options: [
            { label: t("super_admin"), value: "superAdmin" },
            { label: t("admin"), value: "admin" },
            { label: t("manager"), value: "manager" },
            { label: t("stock_controller"), value: "stockController" },
            { label: t("cashier"), value: "cashier" },
          ],
        },
        {
          name: "password",
          label: t("password"),
          grid: { xs: 12 },
        },
        {
          name: "active",
          label: t("active"),
          type: "checkbox",
          grid: { xs: 12 },
        },
      ],
    },
  ];

  return (
    <ReusableForm
      open={open}
      onClose={handleClose}
      dialogTitle={dialogTitle === "Create" ? t("add_user") : t("update_user")}
      initialValues={formValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      tabs={tabs}
      loading={loading}
      t={t}
    />
  );
}
