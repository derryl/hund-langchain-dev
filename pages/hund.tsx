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
      <div className="mx-auto flex flex-col gap-4">
        <button onClick={handleClick}>Click me</button>
        <div className="textarea hund-server-output">
          {response && <code>{JSON.stringify(response)}</code>}
        </div>
      </div>
    </Layout>
  );
}
