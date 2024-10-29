export default function Category({ data }: { data: Category }) {
  return (
    <div>
      <div>ID : {data.id}</div>
      <div>Name : {data.name}</div>
      <div>Created At : {data.createdAt}</div>
      <div>Updated At : {data.updatedAt}</div>
    </div>
  );
}
