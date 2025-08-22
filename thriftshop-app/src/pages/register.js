import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";

export default function Register() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    data.passwordHash = bcrypt.hashSync(data.password, 10);
    delete data.password;
    alert("Registered! (simulate API call)");
    console.log(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Name" className="border p-2 w-full"/>
        <input {...register("email")} placeholder="Email" className="border p-2 w-full"/>
        <input {...register("password")} type="password" placeholder="Password" className="border p-2 w-full"/>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
