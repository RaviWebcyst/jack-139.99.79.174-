// Test Copier

export async function getServerSideProps() {
  let data = await fetch(`${process.env.ROOT_PATH}api/testcopier`);
  data = await data.json();
  return { props: { data: data } };
}

export default function TestCopier(props) {
  console.log(props);
  return (
    <div>
      <h1>Test Copier</h1>
    </div>
  );
}
