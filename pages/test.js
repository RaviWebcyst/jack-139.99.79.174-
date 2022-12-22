export async function getServerSideProps() {
  let res = await fetch(`${process.env.ROOT_PATH}api/test`);
  res = await res.json();
  return { props: { test: res } };
}

export default function Test(props) {
  console.log(props.test);

  return <div>Test</div>;
}
