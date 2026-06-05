import React, { useEffect, useRef } from "react";

// --- UPDATED PRINT STYLES FOR THERMAL PRINTERS ---
const PrintStyles = () => (
  <style type="text/css" media="print">
    {`
      /* 1. Remove the 'size' attribute so the browser defers to the thermal printer's driver (80mm Roll) */
      @page {
        margin: 0;
      }

      /* 2. Lock the html/body to 80mm width */
      html, body {
        width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: white;
      }

      /* 3. Hide EVERYTHING in the app initially */
      body * {
        visibility: hidden;
      }

      /* 4. Make the Receipt Container Visible */
      #receipt-container, #receipt-container * {
        visibility: visible;
      }

      /* 5. Absolute positioning forces it to the top-left of whatever paper size is selected */
      #receipt-container {
        position: absolute; 
        left: 0;
        top: 0;
        width: 80mm !important;
        min-height: 100%;
        height: auto !important; 
        margin: 0 !important;
        padding: 4mm !important;
        box-sizing: border-box;
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
  const advertisements = parseComponents(readQuery("advertisements"));
  const receipt_id = safeDecode(readQuery("receipt_id")) || `ADV-${Date.now()}`;
  const dateIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  useEffect(() => {
    const triggerPrint = async () => {
      // Small delay to allow images to paint before printing
      setTimeout(() => window.print(), 800);
    };
    triggerPrint();
  }, []);

  const styles = {
    container: {
      width: "80mm",
      minHeight: "120mm",
      height: "auto",
      margin: "0 auto",
      padding: "4mm",
      fontFamily: "'Roboto', 'Noto Sans Telugu', sans-serif",
      fontSize: "10px",
      lineHeight: 1.2,
      color: "#000", // Enforce high contrast for thermal
      backgroundColor: "#fff",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible", 
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "2px solid #000",
      paddingBottom: "4px",
      marginBottom: "4px",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    logo: { height: "32px", width: "auto" },
    headerRight: {
      textAlign: "right",
      fontSize: "8px",
      color: "#333",
    },
    sectionTitle: {
      fontSize: "10px",
      fontWeight: "800",
      color: "#000",
      borderBottom: "1px solid #ccc",
      marginTop: "4px",
      marginBottom: "2px",
      paddingBottom: "1px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
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
      fontWeight: "700",
      color: "#333",
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
      borderBottom: "1px solid #000",
      padding: "2px",
      fontWeight: "800",
      color: "#000",
    },
    td: {
      borderBottom: "1px solid #eee",
      padding: "3px 2px",
      verticalAlign: "top",
    },
    footer: {
      textAlign: "center",
      borderTop: "1px dashed #000",
      paddingTop: "6px",
      marginTop: "8px", 
      fontSize: "8px",
      color: "#333",
    },
    adContainer: {
      marginTop: "8px",
      borderTop: "2px solid #000",
      paddingTop: "6px"
    },
    adCard: {
      border: "1px solid #000", // Crisp border for thermal printer
      borderRadius: "4px",
      padding: "5px",
      marginBottom: "6px"
    },
    adHeader: {
      fontSize: "11px",
      fontWeight: "800",
      textAlign: "center",
      marginBottom: "4px",
      textTransform: "uppercase",
      borderBottom: "1px solid #eee",
      paddingBottom: "2px"
    },
    adRow: {
      display: "flex",
      gap: "6px",
      alignItems: "flex-start",
      marginBottom: "4px"
    },
    adImage: {
      width: "24px",
      height: "24px",
      objectFit: "contain",
      borderRadius: "2px",
      border: "1px solid #eee"
    },
    adTitleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    },
    adBrandLine: {
      textAlign: "center",
      fontSize: "7px",
      fontWeight: "800",
      marginTop: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }
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

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {/* Problem & Details */}
          <div style={{ marginBottom: "6px" }}>
            <div style={{ ...styles.teluguText, fontSize: "12px", fontWeight: "800", marginBottom: "2px" }}>
              {problem_name_te || problem_name_en}
            </div>
            <div style={styles.gridTwo}>
              <div style={styles.infoItem}><span style={styles.label}>Category:</span>{category}</div>
              <div style={styles.infoItem}><span style={styles.label}>Stage:</span>{stage}</div>
            </div>
          </div>

          {/* Symptoms & Advisory (Compact) */}
          {(symptoms_te || notes_te) && (
            <div style={{ marginBottom: "6px", border: "1px solid #eee", padding: "4px", borderRadius: "2px" }}>
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
                      <td style={{ ...styles.td, ...styles.teluguText, fontWeight: "700" }}>{c.component_name_te}</td>
                      <td style={{ ...styles.td, ...styles.teluguText }}>{c.dose_te}</td>
                      <td style={{ ...styles.td, ...styles.teluguText }}>{c.application_method_te}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Dynamic Advertisement Block */}
          {advertisements?.length > 0 && (
            <div style={styles.adContainer}>
              {advertisements.map((ad, i) => (
                <div key={i} style={styles.adCard}>
                  {ad.display_title && (
                    <div style={styles.adHeader}>
                      {ad.display_title}
                    </div>
                  )}
                  
                  <div style={styles.adRow}>
                    {ad.image_url_1 && (
                      <img src={ad.image_url_1} alt={ad.product_name} style={styles.adImage} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={styles.adTitleRow}>
                        <div style={{ fontSize: "10px", fontWeight: "800" }}>{ad.product_name}</div>
                        <div style={{ fontSize: "10px", fontWeight: "800" }}>₹{ad.price}</div>
                      </div>
                      {ad.product_description && (
                        <div style={{ fontSize: "8px", color: "#333", marginTop: "2px", lineHeight: 1.3 }}>
                          {ad.product_description}
                        </div>
                      )}
                    </div>
                  </div>

                  {ad.display_message && (
                    <div style={{ fontSize: "9px", fontWeight: "700", textAlign: "center", marginTop: "2px", borderTop: "1px solid #eee", paddingTop: "2px" }}>
                      {ad.display_message}
                    </div>
                  )}
                  
                  <div style={styles.adBrandLine}>
                    Powered by Agri Phero Solutionz
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={{ fontWeight: "800", marginBottom: "2px" }}>Thank You for Using CropSync Kiosk</div>
          <div>www.cropsync.in | +91-91828 67605</div>
        </div>
      </div>
    </>
  );
}
