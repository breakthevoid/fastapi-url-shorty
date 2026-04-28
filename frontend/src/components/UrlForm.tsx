import {useForm} from "react-hook-form";
import {createLink} from "../../api/links.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type {Link} from "../../interfaces/Link.ts";
import {isValidUrl} from "../../utils/url.ts";
import { z } from "zod";

// Define the schema
const schema = z.object({
  websiteUrl: z
    .string()
    .refine((val) => isValidUrl(val), { message: "Неверный формат URL" }) // Ensures it has a protocol (http/https)
    .min(1, { message: "Пожалуйста, укажите URL" }),
});


function UrlForm ({
                    onFormSubmitted
                  } : {onFormSubmitted: Function}) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema), // Link Zod to React Hook Form
  });


  const onSubmit = async(data: FormData) => {
      if (isValidUrl(data.websiteUrl)) {
          const link : Link = {
              fullname: data.websiteUrl
          }
          const result = await createLink(link);
          onFormSubmitted(result);
      }
  }

  return (

    <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3 d-flex gap-4 w-100">
          <input className="form-control" {...register("websiteUrl")} placeholder="Введите URL-адрес" />
          <button type="submit" className="btn btn-warning align-self-center fw-bolder">Сократить</button>
      </div>

      {errors.websiteUrl && <p>{errors.websiteUrl.message}</p>}

    </form>

  );

}

export default UrlForm;