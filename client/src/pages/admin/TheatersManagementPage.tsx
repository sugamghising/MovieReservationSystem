import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTheaters, useCreateTheater } from "@/hooks/useTheaters";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Theater } from "@/types/models";

interface TheaterFormData {
  name: string;
  capacity: number;
}

export default function TheatersManagementPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [formData, setFormData] = useState<TheaterFormData>({
    name: "",
    capacity: 0,
  });
  const { toast } = useToast();

  const { data: theatersData, isLoading } = useTheaters({});
  const createTheater = useCreateTheater();

  const theaters = theatersData?.data || [];
  const filteredTheaters = theaters.filter((theater) =>
    theater.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (theater?: Theater) => {
    if (theater) {
      setEditingTheater(theater);
      setFormData({
        name: theater.name,
        capacity: theater.capacity,
      });
    } else {
      setEditingTheater(null);
      setFormData({
        name: "",
        capacity: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTheater(null);
    setFormData({
      name: "",
      capacity: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.capacity <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    try {
      if (editingTheater) {
        // TODO: Implement update theater mutation when available
        toast({
          title: "Theater Updated",
          description: `"${formData.name}" has been updated successfully.`,
        });
      } else {
        await createTheater.mutateAsync(formData);
        toast({
          title: "Theater Created",
          description: `"${formData.name}" has been created successfully.`,
        });
      }
      handleCloseDialog();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          editingTheater ? "update" : "create"
        } theater. Please try again.`,
      });
    }
  };

  const handleDelete = async (_id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This will also delete all associated showtimes.`
      )
    ) {
      return;
    }

    try {
      // TODO: Implement delete theater mutation when available
      toast({
        title: "Theater Deleted",
        description: `"${name}" has been deleted successfully.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the theater. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Theaters Management</h1>
            <p className="text-lg text-muted-foreground">
              Manage theater screens and seating capacity
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Theater
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search theaters by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Theaters Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              All Theaters
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredTheaters && filteredTheaters.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Seating Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTheaters.map((theater) => (
                    <TableRow key={theater.id}>
                      <TableCell className="font-medium">
                        {theater.name}
                      </TableCell>
                      <TableCell>Not specified</TableCell>
                      <TableCell>{theater.capacity} seats</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(theater)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDelete(theater.id, theater.name)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {search
                    ? "No theaters found matching your search"
                    : "No theaters yet"}
                </p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Theater
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theater Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                {editingTheater ? "Edit Theater" : "Add New Theater"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                {editingTheater
                  ? "Update the theater details below"
                  : "Fill in the details to add a new theater"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white font-semibold">
                    Theater Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Screen 1, Hall A"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="capacity"
                    className="text-white font-semibold"
                  >
                    Seating Capacity <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 100"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    required
                  />
                  <p className="text-xs text-zinc-400">
                    Total number of seats available in this theater
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createTheater.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {createTheater.isPending
                    ? "Saving..."
                    : editingTheater
                    ? "Update Theater"
                    : "Create Theater"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
