import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { CREATE_USER, UPDATE_USER } from "../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
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
  const [uploadedFilePath, setUploadedFilePath] = useState(null);

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

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: ({ createUser }) => {
      setLoading(false);
      if (createUser?.isSuccess) {
        setAlert(true, "success", createUser.message);
        onClose();
        setRefetch();
      } else setAlert(true, "error", createUser.message);
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser }) => {
      setLoading(false);
      if (updateUser?.isSuccess) {
        setAlert(true, "success", updateUser.message);
        onClose();
        setRefetch();
      } else setAlert(true, "error", updateUser.message);
    },
    onError: (error) => {
      setLoading(false);
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

      if (userData.image) {
        setUploadedFilePath(userData.image.split("/").pop());
      }
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
    if (dialogTitle === "Create") {
      createUser({ variables: { input: values } });
    } else {
      updateUser({ variables: { id: userData._id, input: values } });
    }
  };

  const handleClose = async () => {
    if (dialogTitle === "Create" && uploadedFilePath) {
      await supabase.storage.from("images").remove([uploadedFilePath]);
    }
    onClose();
  };

  const tabs = [
    {
      fields: [
        { name: "image", label: t("image"), type: "image", grid: { xs: 12 } },
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
