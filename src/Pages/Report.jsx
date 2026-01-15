import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";

const CREATE_PAYMENT = gql`
  mutation CreateBakongPayment($input: CreateBakongPaymentInput!) {
    createBakongPayment(input: $input) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

const GET_PAYMENT = gql`
  query getBakongPayment($reference: String!) {
    getBakongPayment(reference: $reference) {
      qrImage
      reference
      amount
      status
    }
  }
`;

const CHECK_PAYMENT = gql`
  mutation checkBakongPayment($reference: String!) {
    checkBakongPayment(reference: $reference) {
      isSuccess
      message {
        messageEn
        messageKh
      }
      data {
        status
      }
    }
  }
`;

const Report = () => {
  const [reference, setReference] = useState(null);
  const [qrImage, setQrImage] = useState(null);

  const [createPayment] = useMutation(CREATE_PAYMENT);
  const [checkPayment] = useMutation(CHECK_PAYMENT);

  // ✅ useQuery to fetch payment info, skip until reference exists
  const { data, loading, error } = useQuery(GET_PAYMENT, {
    variables: { reference },
    skip: !reference,
    fetchPolicy: "network-only",
  });

  // ✅ Set qrImage and reference whenever data is returned
  useEffect(() => {
    if (data?.getBakongPayment) {
      setQrImage(data.getBakongPayment.qrImage);
      setReference(data.getBakongPayment.reference);
    }
  }, [data]);

  const handlePayment = async () => {
    try {
      // 1️⃣ Generate QR
      const { data: createData } = await createPayment({
        variables: { input: { amount: 15000, billNumber: "INV1001" } },
      });

      const ref = createData?.createBakongPayment?.data?.reference;
      if (!ref) {
        console.error("No reference returned from mutation", createData);
        return;
      }

      setReference(ref); 

      
      const interval = setInterval(async () => {
        const { data: statusData } = await checkPayment({
          variables: { reference: ref },
        });

        if (statusData?.checkBakongPayment?.isSuccess) {
          clearInterval(interval);
          alert("Payment successful!");
        }
      }, 3000);
    } catch (err) {
      console.error("Error generating payment:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={handlePayment}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Generate QR
      </button>

      {loading && <p>Loading QR...</p>}
      {error && <p>Error fetching QR: {error.message}</p>}

      {qrImage && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={qrImage} 
            alt="Scan QR"
            style={{ width: "200px", height: "200px" }}
          />
          <p>Reference: {reference}</p>
        </div>
      )}
    </div>
  );
};

export default Report;
