import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const RECEIPT_API = 'https://kiosk.cropsync.in/get_receipt_payload.php';

const css = `
  @page { size: 80mm 180mm; margin: 0; }
  :root { color: #111; background: #fff; font-family: Lexend, "Noto Sans Telugu", sans-serif; }
  * { box-sizing: border-box; }
  html, body, #root { width: 80mm; min-height: 180mm; margin: 0; padding: 0; background: #fff; }
  body { font-size: 10px; line-height: 1.25; }
  #receipt { width: 80mm; min-height: 180mm; padding: 4mm; display: flex; flex-direction: column; background: #fff; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 4px; margin-bottom: 5px; }
  .logo { height: 30px; width: auto; object-fit: contain; }
  .header-right { text-align: right; font-size: 7px; color: #444; }
  .title { font-family: "Noto Sans Telugu", Lexend, sans-serif; font-size: 12px; font-weight: 800; margin-bottom: 3px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 5px; }
  .label { font-weight: 800; color: #333; margin-right: 3px; }
  .box { border: 1px solid #eee; border-radius: 2px; padding: 4px; margin-bottom: 5px; }
  .telugu { font-family: "Noto Sans Telugu", Lexend, sans-serif; }
  .section-title { font-size: 9px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 2px; margin: 5px 0 3px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 7px; }
  th { background: #f4f4f4; font-weight: 800; text-align: left; }
  th, td { border: 1px solid #d8d8d8; padding: 2px; vertical-align: top; overflow-wrap: anywhere; }
  .ad { border: 1px solid #d8d8d8; border-radius: 2px; padding: 4px; margin-top: 5px; }
  .ad-header { font-size: 9px; font-weight: 800; border-bottom: 1px solid #eee; padding-bottom: 2px; margin-bottom: 3px; }
  .ad-row { display: flex; gap: 5px; align-items: flex-start; }
  .ad-image { width: 25px; height: 25px; object-fit: contain; border: 1px solid #eee; }
  .ad-main { flex: 1; min-width: 0; }
  .ad-title-row { display: flex; justify-content: space-between; gap: 3px; font-size: 9px; font-weight: 800; }
  .ad-description { font-size: 7px; line-height: 1.3; margin-top: 2px; }
  .guide { border-top: 1px dotted #ccc; padding-top: 3px; margin-top: 4px; font-size: 7px; }
  .guide-title { font-size: 8px; font-weight: 800; text-transform: uppercase; margin-bottom: 2px; }
  .guide ul { margin: 0; padding-left: 12px; }
  .ad-message { text-align: center; font-size: 8px; font-weight: 700; border-top: 1px solid #eee; padding-top: 2px; margin-top: 4px; }
  .brand { text-align: center; font-size: 7px; font-weight: 800; text-transform: uppercase; letter-spacing: .3px; margin-top: 4px; }
  .footer { text-align: center; border-top: 1px dashed #111; padding-top: 5px; margin-top: auto; font-size: 7px; color: #444; }
  .footer strong { display: block; color: #111; margin-bottom: 2px; }
  .status { width: 80mm; min-height: 180mm; padding: 10mm 5mm; font-family: Lexend, sans-serif; font-size: 12px; }
  .error { color: #a00; }
  @media screen { body { margin: 0 auto; } #receipt { min-height: 180mm; } }
  @media print { .screen-only { display: none !important; } }
`;

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function display(value) {
  return value === null || value === undefined ? '' : String(value);
}

function Receipt({ data }) {
  const components = asArray(data.components);
  const advertisements = asArray(data.advertisements);
  const receiptId = display(data.receipt_id);

  return (
    <article id="receipt">
      <header className="header">
        <img className="logo" src="https://kiosk.cropsync.in/logo_v.jpeg" alt="CropSync logo" />
        <div className="header-right">
          <div>{display(data.date)}</div>
          <div>ID: {receiptId.slice(-6)}</div>
        </div>
      </header>

      <div>
        <div className="title telugu">
          {display(data.problem_name_te || data.problem_name_en || 'Advisory')}
        </div>

        <div className="grid">
          <div><span className="label">Category:</span>{display(data.category || '-')}</div>
          <div><span className="label">Stage:</span>{display(data.stage || '-')}</div>
        </div>

        {(data.symptoms_te || data.symptoms_en) && (
          <div className="box">
            <span className="label">Symptoms:</span>
            <span className="telugu">{display(data.symptoms_te || data.symptoms_en)}</span>
          </div>
        )}

        {components.length > 0 && (
          <>
            <div className="section-title">Recommended Treatment</div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Type</th>
                  <th style={{ width: '30%' }}>Name</th>
                  <th style={{ width: '20%' }}>Dose</th>
                  <th style={{ width: '30%' }}>Method</th>
                </tr>
              </thead>
              <tbody>
                {components.map((component, index) => (
                  <tr key={`${component.component_name_en || 'component'}-${index}`}>
                    <td>{display(component.component_type)}</td>
                    <td className="telugu">
                      <strong>{display(component.component_name_te || component.component_name_en)}</strong>
                      {component.alt_component_name_te && (
                        <><br />{display(component.alt_component_name_te)}</>
                      )}
                    </td>
                    <td className="telugu">
                      {display(component.dose_te || component.dose_en)}
                    </td>
                    <td className="telugu">
                      {display(component.application_method_te || component.application_method_en)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {advertisements.map((ad, index) => {
          const guideItems = [
            ad.dosage_per_acre && ['Dosage:', ad.dosage_per_acre],
            ad.replacement_period && ['Maintenance:', ad.replacement_period],
            ad.installation_guide && ['Installation:', ad.installation_guide],
            ad.product_benefits && ['Benefits:', ad.product_benefits],
          ].filter(Boolean);

          return (
            <section className="ad" key={`${ad.product_id || 'ad'}-${index}`}>
              {ad.display_title && <div className="ad-header telugu">{display(ad.display_title)}</div>}
              <div className="ad-row">
                {ad.image_url_1 && (
                  <img
                    className="ad-image"
                    src={ad.image_url_1}
                    alt={display(ad.product_name)}
                    onError={(event) => { event.currentTarget.style.display = 'none'; }}
                  />
                )}
                <div className="ad-main">
                  <div className="ad-title-row">
                    <span>{display(ad.product_name)}</span>
                    <span>{ad.price ? `₹${display(ad.price)}` : ''}</span>
                  </div>
                  {ad.product_description && (
                    <div className="ad-description telugu">{display(ad.product_description)}</div>
                  )}
                </div>
              </div>

              {guideItems.length > 0 && (
                <div className="guide">
                  <div className="guide-title">Installation &amp; Usage Guide</div>
                  <ul>
                    {guideItems.map(([label, value]) => (
                      <li key={label}><strong>{label}</strong> {display(value)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ad.display_message && (
                <div className="ad-message telugu">{display(ad.display_message)}</div>
              )}
              <div className="brand">
                Powered by {display(ad.advertiser_name || 'Agri Phero Solutionz')}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="footer">
        <strong>Thank You for Using CropSync Kiosk</strong>
        www.cropsync.in | +91-91828 67605
      </footer>
    </article>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadReceipt() {
      const receiptId = new URLSearchParams(window.location.search).get('receipt_id');

      if (!receiptId) {
        throw new Error(
          'Receipt ID is missing. Open the receipt using the URL returned by the CropSync kiosk.'
        );
      }

      const response = await fetch(
        `${RECEIPT_API}?receipt_id=${encodeURIComponent(receiptId)}`,
        { headers: { Accept: 'application/json' } }
      );

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('The receipt API did not return valid JSON.');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Receipt data could not be loaded.');
      }

      if (!cancelled) setData(result.data);
    }

    loadReceipt().catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!data) return;

    const printReceipt = () => window.print();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setTimeout(printReceipt, 500));
    } else {
      setTimeout(printReceipt, 800);
    }
  }, [data]);

  return (
    <>
      <style>{css}</style>
      {error ? (
        <main className="status error">
          <strong>Receipt error</strong><br />{error}
        </main>
      ) : data ? (
        <Receipt data={data} />
      ) : (
        <main className="status">Loading receipt…</main>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
