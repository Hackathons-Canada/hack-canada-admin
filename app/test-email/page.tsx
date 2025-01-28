import AcceptanceEmail from "@/components/Emails/AcceptanceEmail";
import { render } from "@react-email/render";

const page = async () => {
  const emailHtml = render(AcceptanceEmail({ name: "John" }));

  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
};
export default page;
