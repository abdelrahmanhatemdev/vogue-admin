// "use client";
// import { Button } from "@/components/ui/button";
// import { DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Dispatch, memo, SetStateAction, useTransition } from "react";
// import { addSubproduct } from "@/actions/Subproduct";
// import { notify } from "@/lib/utils";
// import useData from "@/hooks/useData";
// import { MultiSelect } from "@/components/ui/multiselect";
// import Link from "next/link";
// import { Switch } from "@/components/ui/switch";
// import { isValidSku } from "@/lib/isValid";

// const validCurrencies = currencies.map((c) => c.code) as [string, ...string[]];

// export const SubproductSchema = z.object({
//   sku: z
//     .string()
//     .min(1, {
//       message: "SKU is required",
//     })
//     .max(12, {
//       message: "SKU should not have more than 20 charachters.",
//     }),
//   colors: z.array(z.string()).nonempty({
//     message: "Choose at least one color",
//   }),
//   sizes: z.array(z.string()).nonempty({
//     message: "Choose at least one size",
//   }),
//   price: z.coerce
//     .number({ message: "Price is required" })
//     .min(1, {
//       message: "Price is required",
//     })
//     .positive("Price must be positive"),
//   currency: z.enum(validCurrencies, { message: "Invalid currency" }),
//   discount: z.coerce
//     .number()
//     .positive("Discount must be positive")
//     .min(1, {
//       message: "Discount is required",
//     })
//     .max(100, {
//       message: "Discount cannot be more than 100%",
//     }),
//   qty: z.coerce.number().positive("Price must be positive"),
//   sold: z.coerce.number().positive("Price must be positive"),
//   featured: z.boolean(),
//   inStock: z.boolean(),
//   images: z
//   .any()
//     // .custom<FileList>(files => files instanceof FileList, {
//     //   message: "Must be a valid file input"
//     // })
//     // .refine(files => files && files.length > 0 , {
//     //   message: "At least one photo is required"
//     // })
   
// });
// import { v4 as uuid4 } from "uuid";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { currencies } from "@/constants/currencies";
// import { addImage } from "@/actions/Image";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// function AddSubproduct({
//   setModalOpen,
//   addOptimisticData,
//   productId,
// }: {
//   setModalOpen: Dispatch<SetStateAction<boolean>>;
//   addOptimisticData: (
//     action: Subproduct[] | ((pendingState: Subproduct[]) => Subproduct[])
//   ) => void;
//   productId: string;
// }) {
//   const { data: colors } = useData("colors");
//   const { data: sizes } = useData("sizes");


  

//   const form = useForm<z.infer<typeof SubproductSchema>>({
//     resolver: zodResolver(SubproductSchema),
//     defaultValues: {
//       price: 0,
//       currency: "USD",
//       featured: false,
//       inStock: false,
//       images: ""
//     },
//     mode: "onChange",
//   });

//   const [isPending, startTransition] = useTransition();

//   async function onSubmit(values: z.infer<typeof SubproductSchema>) {
//     setModalOpen(false);
//     const date = new Date().toISOString();
//     const data = {
//       id: uuid4(),
//       ...values,
//       productId,
//       createdAt: date,
//       updatedAt: date,
//     };
//     // console.log("data", data);

//     const optimisticObj: Subproduct = {
//       ...data,
//       isPending: !isPending,
//     };


//     if (data.images.length > 0) {
      
//     }
    
    
   

//     // startTransition(() => {
//     //   addOptimisticData((prev: Subproduct[]) => [...prev, optimisticObj]);
//     // });
//     // const res: ActionResponse = await addSubproduct(data);
//     // notify(res);
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-2"
//         encType="multipart/form-data"
//       >
//         <FormField
//           control={form.control}
//           name="sku"
//           render={({ field }) => (
//             <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//               <FormLabel>SKU</FormLabel>
//               <FormControl>
//                 <Input
//                   {...field}
//                   onChange={async (e) => {
//                     field.onChange(e.target.value);

//                     const checkSku: boolean = await isValidSku({
//                       sku: e.target.value,
//                       collection: "products",
//                     });

//                     if (!checkSku) {
//                       form.setError("sku", {
//                         message: "Sku is already used!",
//                       });
//                       return;
//                     } else {
//                       form.clearErrors("sku");
//                     }
//                   }}
//                 />
//               </FormControl>
//               <FormDescription>New Subproduct SKU</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="images"
//           render={({ field }) => (
//             <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//               <FormLabel className="border border-dashed border-main-200 bg-main-100 flex justify-center rounded-lg items-center h-full cursor-pointer">
//                 <div className="flex flex-col items-center gap-1 justify-center">
//                   <div>Choose Photos</div>
//                   <div>
//                     <FormMessage />
//                   </div>
//                 </div>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   multiple
//                   type="file"
                  
//                   onChange={async (e) => {
//                     const files = e.target?.files ? Array.from(e.target?.files) : []
                   
//                      form.setValue("files", files)

//                      console.log("files", files);
                     

//                      try {
//                       const uploadPromises = files.map(async file => {

//                       const fileRef = ref(storage, `subproducts/${file.name}-${Date.now()}`)
//                       await uploadBytes(fileRef, file)
//                       const downloadURL = await getDownloadURL(fileRef)

//                       console.log("downloadURL", downloadURL);
                      
//                       }
//                       )

//                      } catch (error) {
                      
                    
                     
//                     }
                   
//                   }}
//                   className="hidden"
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="colors"
//           render={({ field }) => (
//             <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//               <FormLabel>Colors</FormLabel>
//               {colors ? (
//                 <MultiSelect
//                   options={colors.map((item) => ({
//                     value: item.id,
//                     color: item.hex,
//                     label:
//                       item.name?.length > 5
//                         ? item.name.slice(0, 5) + ".."
//                         : item.name,
//                   }))}
//                   onValueChange={field.onChange}
//                   placeholder="Select Colors"
//                   asChild
//                   className="cursor-pointer"
//                 />
//               ) : (
//                 <Link href={`/admin/colors`} className="block text-sm">
//                   Add some colors to select from{" "}
//                   <Button variant={"outline"} size={"sm"}>
//                     Go to colors
//                   </Button>
//                 </Link>
//               )}
//               <FormDescription>New subproduct colors</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="sizes"
//           render={({ field }) => (
//             <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//               <FormLabel>Sizes</FormLabel>
//               {sizes ? (
//                 <MultiSelect
//                   options={sizes.map((item) => ({
//                     value: item.id,
//                     label:
//                       item.name?.length > 5
//                         ? item.name.slice(0, 5) + ".."
//                         : item.name,
//                   }))}
//                   onValueChange={field.onChange}
//                   placeholder="Select sizes"
//                   asChild
//                   className="cursor-pointer"
//                 />
//               ) : (
//                 <Link href={`/admin/sizes`} className="block text-sm">
//                   Add some sizes to select from{" "}
//                   <Button variant={"outline"} size={"sm"}>
//                     Go to sizes
//                   </Button>
//                 </Link>
//               )}
//               <FormDescription>New subproduct sizes</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormControl>
//           <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//             <FormLabel>Price</FormLabel>
//             <div className="flex">
//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <Input {...field} className="min-w-[60%] rounded-e-none" />
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="currency"
//                 render={({ field }) => (
//                   <FormItem className="w-[40%] text-xs">
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger className="bg-main-200 rounded-s-none">
//                         <SelectValue
//                           placeholder="Select Currency"
//                           className="truncate"
//                         >
//                           {field.value}
//                         </SelectValue>
//                       </SelectTrigger>
//                       <SelectContent>
//                         {currencies.map((c) => (
//                           <SelectItem
//                             value={`${c.code}`}
//                             title={`${c.name}`}
//                             className="cursor-pointer"
//                             key={`${c.code}`}
//                           >
//                             {`${c.code}  (${c.name})`}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <FormDescription>New subproduct price</FormDescription>
//             <div className="text-[0.8rem] font-medium text-destructive">
//               <p>{form.formState?.errors?.price?.message}</p>
//               <p>{form.formState?.errors?.currency?.message}</p>
//             </div>
//           </FormItem>
//         </FormControl>

//         <FormField
//           control={form.control}
//           name="discount"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>discount</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormDescription>New subproduct discount</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="qty"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Qty</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormDescription>New subproduct qty</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="sold"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Sold</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormDescription>New subproduct sold</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="featured"
//           render={({ field }) => (
//             <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//               <div className="flex justify-between items-center">
//                 <FormLabel>Featured</FormLabel>
//                 <FormControl>
//                   <Switch
//                     {...field}
//                     value={`${field.value}`}
//                     onCheckedChange={field.onChange}
//                     checked={field.value}
//                   />
//                 </FormControl>
//               </div>
//               <FormDescription>New subproduct is Featured</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="inStock"
//           render={({ field }) => (
//             <FormItem className="w-full lg:w-[calc(50%-.75rem)]">
//               <div className="flex justify-between items-center">
//                 <FormLabel>In Stock</FormLabel>
//                 <FormControl>
//                   <Switch
//                     {...field}
//                     value={`${field.value}`}
//                     onCheckedChange={field.onChange}
//                     checked={field.value}
//                   />
//                 </FormControl>
//               </div>
//               <FormDescription>New subproduct is InStock</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <DialogFooter className="w-full">
//           <Button type="submit">Add</Button>
//         </DialogFooter>
//       </form>
//     </Form>
//   );
// }

// export default memo(AddSubproduct);
