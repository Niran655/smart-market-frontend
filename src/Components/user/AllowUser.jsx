import { useMutation } from "@apollo/client/react";
import { Switch } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";

import { UPDATE_USER_STATUS } from "../../../graphql/mutation";
import { useAuth } from "../../Context/AuthContext";


export default function AllowUser({ refetch, editData }) {
  const [checked, setChecked] = useState(!!editData?.active);
  const prev = useRef(checked);
  const [busy, setBusy] = useState(false);
  const { setAlert } = useAuth();

  useEffect(() => setChecked(!!editData?.active), [editData?.active]);
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    onCompleted: ({ updateUserStatus}) => {
      setAlert?.(true, "success", updateUserStatus?.message);
      if(updateUserStatus?.isSuccess){
        refetch?.()
      }else{
        setChecked(prev.current)
      }
    },
    onError: (e) => {
      setChecked(prev.current);
      setAlert?.(true, "error", e.message || "Error");
      console.error("Update error:", e);
    },
  });
  
  const handle = async (e) => {
    if (!editData?._id) return;
    prev.current = checked;
    setChecked(e.target.checked);
    setBusy(true);
    try {
      await updateUserStatus({ variables: { id: editData._id, active: e.target.checked } });
    } finally {
      setBusy(false);
    }
  };

  return <Switch onChange={handle} checked={checked} disabled={busy} />;
}