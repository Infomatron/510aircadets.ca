import Layout from "@theme-original/Layout";
import type { Props } from "@theme/Layout";
import PageLastModified from "../../components/PageLastModified";

export default function DatedLayout({ children, ...props }: Props) {
  return (
    <Layout {...props}>
      {children}
      <PageLastModified />
    </Layout>
  );
}
