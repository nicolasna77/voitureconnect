import ListProduct from "@/components/component/list-product";
import SearchForm from "@/components/component/search-form";

const page = () => {
  return (
    <div className=" py-24">
      <SearchForm />
      <ListProduct />
    </div>
  );
};
export default page;
