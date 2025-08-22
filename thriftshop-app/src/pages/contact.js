import { useForm } from "react-hook-form";

export default function Contact() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Message sent!");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Name</label>
          <input {...register("name", { required: true })} className="border p-2 w-full"/>
          {errors.name && <span className="text-red-500">Name is required</span>}
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input {...register("email", { required: true })} type="email" className="border p-2 w-full"/>
          {errors.email && <span className="text-red-500">Email is required</span>}
        </div>
        <div>
          <label className="block mb-1">Message</label>
          <textarea {...register("message", { required: true })} className="border p-2 w-full"/>
          {errors.message && <span className="text-red-500">Message is required</span>}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
