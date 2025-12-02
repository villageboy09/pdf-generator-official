import React, { useEffect, useRef } from "react";

// --- UPDATED PRINT STYLES ---
const PrintStyles = () => (
  <style type="text/css" media="print">
    {`
      /* 1. Set the physical paper size */
      @page {
        size: 80mm 120mm;
        margin: 0mm;
      }

      /* 2. Reset html/body to allow full width usage */
      html, body {
        width: 80mm !important;
        height: 120mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: white;
      }

      /* 3. Hide EVERYTHING in the app initially */
      body * {
        visibility: hidden;
        height: 0; /* Collapses space of hidden elements */
      }

      /* 4. Make the Receipt Container Visible and Positioned */
      #receipt-container, #receipt-container * {
        visibility: visible;
        height: auto; /* Restore height */
      }

      #receipt-container {
        position: fixed; /* Fixed puts it relative to the window/paper */
        left: 0;
        top: 0;
        width: 80mm !important;
        height: 120mm !important;
        margin: 0 !important;
        padding: 4mm !important;
        box-sizing: border-box;
        overflow: hidden;
      }
    `}
  </style>
);

const readQuery = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

const safeDecode = (v) => {
  try {
    return v ? decodeURIComponent(v) : null;
  } catch {
    return v;
  }
};

const parseComponents = (str) => {
  if (!str) return [];
  try {
    const decoded = safeDecode(str);
    return JSON.parse(decoded);
  } catch {
    return [];
  }
};

export default function App() {
  const pdfRef = useRef(null);

  const problem_name_te = safeDecode(readQuery("problem_name_te")) || "";
  const problem_name_en = safeDecode(readQuery("problem_name_en")) || "Advisory";
  const category = safeDecode(readQuery("category")) || "-";
  const stage = safeDecode(readQuery("stage")) || "-";
  const symptoms_te = safeDecode(readQuery("symptoms_te")) || "";
  const notes_te = safeDecode(readQuery("notes_te")) || "";
  const components = parseComponents(readQuery("components"));
  const receipt_id = safeDecode(readQuery("receipt_id")) || `ADV-${Date.now()}`;
  const dateIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  useEffect(() => {
    const triggerPrint = async () => {
      // Small delay to allow images to paint
      setTimeout(() => window.print(), 800);
    };
    triggerPrint();
  }, []);

  const styles = {
    container: {
      width: "80mm",
      height: "120mm",
      margin: "0 auto",
      padding: "4mm",
      fontFamily: "'Roboto', 'Noto Sans Telugu', sans-serif",
      fontSize: "10px",
      lineHeight: 1.2,
      color: "#333",
      backgroundColor: "#fff",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden", // Ensure content doesn't spill out visually in fixed mode
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "2px solid #2c3e50",
      paddingBottom: "4px",
      marginBottom: "4px",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    logo: { height: "32px", width: "auto" },
    brandName: {
      fontSize: "14px",
      fontWeight: "800",
      color: "#2c3e50",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    headerRight: {
      textAlign: "right",
      fontSize: "8px",
      color: "#555",
    },
    sectionTitle: {
      fontSize: "10px",
      fontWeight: "700",
      color: "#2c3e50",
      borderBottom: "1px solid #eee",
      marginTop: "4px",
      marginBottom: "2px",
      paddingBottom: "1px",
      textTransform: "uppercase",
    },
    gridTwo: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "4px",
      marginBottom: "4px",
    },
    infoItem: {
      fontSize: "9px",
    },
    label: {
      fontWeight: "600",
      color: "#7f8c8d",
      marginRight: "3px",
    },
    teluguText: {
      fontFamily: "'Noto Sans Telugu', sans-serif",
      fontSize: "10px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "4px",
      fontSize: "9px",
    },
    th: {
      textAlign: "left",
      borderBottom: "1px solid #333",
      padding: "2px",
      fontWeight: "700",
      color: "#2c3e50",
    },
    td: {
      borderBottom: "1px solid #eee",
      padding: "3px 2px",
      verticalAlign: "top",
    },
    footer: {
      textAlign: "center",
      borderTop: "1px dashed #ccc",
      paddingTop: "4px",
      marginTop: "auto", // Push to bottom
      fontSize: "8px",
      color: "#7f8c8d",
    },
  };

  return (
    <>
      <PrintStyles />
      <div ref={pdfRef} id="receipt-container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoSection}>
            <img
              alt="Logo"
              src="https://kiosk.cropsync.in/logo_v.jpeg"
              style={styles.logo}
            />
          </div>
          <div style={styles.headerRight}>
            <div>{dateIST}</div>
            <div>ID: {receipt_id.slice(-6)}</div>
          </div>
        </div>

        {/* Main Content Area - Flex Grow to fill space */}
        <div style={{ flex: 1 }}>
          {/* Problem & Details */}
          <div style={{ marginBottom: "6px" }}>
            <div style={{ ...styles.teluguText, fontSize: "12px", fontWeight: "700", color: "#e74c3c", marginBottom: "2px" }}>
              {problem_name_te || problem_name_en}
            </div>
            <div style={styles.gridTwo}>
              <div style={styles.infoItem}><span style={styles.label}>Category:</span>{category}</div>
              <div style={styles.infoItem}><span style={styles.label}>Stage:</span>{stage}</div>
            </div>
          </div>

          {/* Symptoms & Advisory (Compact) */}
          {(symptoms_te || notes_te) && (
            <div style={{ marginBottom: "6px", backgroundColor: "#f9f9f9", padding: "4px", borderRadius: "4px" }}>
              {symptoms_te && (
                <div style={{ marginBottom: "2px" }}>
                  <span style={styles.label}>Symptoms:</span>
                  <span style={styles.teluguText}>{symptoms_te.replace(/\n/g, ", ")}</span>
                </div>
              )}
              {notes_te && (
                <div>
                  <span style={styles.label}>Note:</span>
                  <span style={styles.teluguText}>{notes_te.replace(/\n/g, ", ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Treatment Table */}
          {components?.length > 0 && (
            <div>
              <div style={styles.sectionTitle}>Recommended Treatment</div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: "25%" }}>Type</th>
                    <th style={{ ...styles.th, width: "35%" }}>Name</th>
                    <th style={{ ...styles.th, width: "20%" }}>Dose</th>
                    <th style={{ ...styles.th, width: "20%" }}>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((c, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{c.component_type}</td>
                      <td style={{ ...styles.td, ...styles.teluguText, fontWeight: "600" }}>{c.component_name_te}</td>
                      <td style={{ ...styles.td, ...styles.teluguText }}>{c.dose_te}</td>
                      <td style={{ ...styles.td, ...styles.teluguText }}>{c.application_method_te}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ fontWeight: "700", marginBottom: "2px" }}>Thank You for Using CropSync Kiosk</div>
          <div>www.cropsync.in | +91-91828 67605</div>
        </div>
      </div>
    </>
  );
}
