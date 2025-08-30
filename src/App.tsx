import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

// Types
type CurrencyRate = {
  currency: string;
  code: string;
  rate: number;
};

// Capitalize function
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Fetch rates from CNB through proxy
const fetchRates = async (): Promise<CurrencyRate[]> => {
  const res = await fetch(
    "/cnb/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
  );
  const text = await res.text();
  const lines = text.split("\n").slice(2);
  const rates: CurrencyRate[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const [country, currency, amount, code, rate] = line.split("|");
    rates.push({
      currency,
      code,
      rate: Number(rate.replace(",", ".")) / Number(amount),
    });
  }

  return rates;
};

export default function App() {
  const { data: rates, isLoading } = useQuery({
    queryKey: ["rates"],
    queryFn: fetchRates,
  });

  const [amount, setAmount] = useState<number | string>("");
  const [currencyCode, setCurrencyCode] = useState<string>("EUR");
  const [converted, setConverted] = useState<number | null>(null);

  // Real-time conversion
  useEffect(() => {
    if (!rates || amount === "" || Number(amount) <= 0) {
      setConverted(null);
      return;
    }
    const rate = rates.find((r) => r.code === currencyCode);
    if (rate) {
      setConverted(Number(amount) / rate.rate);
    }
  }, [amount, currencyCode, rates]);

  if (isLoading) return <div className="container">Loading exchange rates...</div>;

  return (
    <div className="container">
      <h1>CZK Currency Converter</h1>

      <div className="form">
        <input
          className="input"
          type="number"
          placeholder="Amount in CZK"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="select"
          value={currencyCode}
          onChange={(e) => setCurrencyCode(e.target.value)}
        >
          {rates?.map((r) => (
            <option key={r.code} value={r.code}>
              {capitalize(r.currency)} ({r.code})
            </option>
          ))}
        </select>
      </div>

      {converted !== null && (
        <div className="result-card">
          {amount} CZK = {converted.toFixed(2)} {currencyCode}
        </div>
      )}

      <h2>Latest Exchange Rates</h2>
      <ul className="rate-list">
        {rates?.map((r) => (
          <li key={r.code} className="rate-item">
            {capitalize(r.currency)} ({r.code}) — {r.rate} CZK
          </li>
        ))}
      </ul>
    </div>
  );
}
