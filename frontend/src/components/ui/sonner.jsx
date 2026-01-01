import { Toaster as Sonner, toast } from "sonner"

const Toaster = (props) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-slate-900 border-slate-200 shadow-lg rounded-xl",
          description: "text-slate-500",
          actionButton:
            "bg-teal-600 text-white",
          cancelButton:
            "bg-slate-100 text-slate-600",
          success: "bg-emerald-50 border-emerald-200 text-emerald-900",
          error: "bg-rose-50 border-rose-200 text-rose-900",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast }
