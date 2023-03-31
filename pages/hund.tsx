import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';

export default function Hund() {
  const [response, setResponse] = useState('');

  async function handleClick() {
    try {
      const res = await fetch('/api/ping');
      const json = await res.json();
      console.log(json);
      setResponse(json.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <button onClick={handleClick}>Click me</button>
      {response && <p>{response}</p>}
    </Layout>
  );
}
