import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { deleteUser } from "@/actions/delete-user";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

type Props = {
  id: string;
  name: string;
  children: React.ReactNode;
};

const DeleteUserModal = ({ id, name, children }: Props) => {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (input !== id) {
      toast.error("Invalid ID Entered");
      return;
    }

    startTransition(async () => {
      try {
        const res = await deleteUser(id, input);

        if (res.error) {
          toast.error(res.error);
          return;
        }

        toast.success("User deleted successfully");
        router.push("/users");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {name}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All trace of their existence will be
            lost from the database.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="space-y-4"
        >
          <Label className="pointer-events-none select-none">
            Type to confirm: {id}
          </Label>
          <Input
            onChange={(e) => setInput(e.target.value)}
            placeholder="ID"
            disabled={isPending}
          />
          <Button className="w-full" variant="destructive">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Delete User"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteUserModal;
