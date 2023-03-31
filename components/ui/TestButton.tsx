export const TestButton = () => {
  const handleClick = async () => {
    try {
      const res = await fetch('/api/ping');
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return <button onClick={handleClick}>Click me</button>;
};
