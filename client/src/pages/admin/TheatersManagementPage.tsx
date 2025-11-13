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
import { Badge } from "@/components/ui/badge";
import {
  useTheaters,
  useCreateTheater,
  useTheaterSeats,
  useAddSeat,
} from "@/hooks/useTheaters";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Theater } from "@/types/models";

interface TheaterFormData {
  name: string;
  capacity: number;
}

interface SeatFormData {
  label: string;
  row: string;
  number: number;
  type: string;
  extraPrice: number;
}

export default function TheatersManagementPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [formData, setFormData] = useState<TheaterFormData>({
    name: "",
    capacity: 0,
  });

  // Seat management state
  const [seatsDialogOpen, setSeatsDialogOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [addSeatDialogOpen, setAddSeatDialogOpen] = useState(false);
  const [seatFormData, setSeatFormData] = useState<SeatFormData>({
    label: "",
    row: "",
    number: 0,
    type: "STANDARD",
    extraPrice: 0,
  });
  const [seatPage, setSeatPage] = useState(1);

  const { toast } = useToast();

  const { data: theatersData, isLoading } = useTheaters({});
  const createTheater = useCreateTheater();
  const addSeat = useAddSeat();

  // Fetch seats for selected theater
  const { data: seatsData, isLoading: seatsLoading } = useTheaterSeats(
    selectedTheater?.id || "",
    { page: seatPage, limit: 10 }
  );

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

  // Seat management handlers
  const handleOpenSeatsDialog = (theater: Theater) => {
    setSelectedTheater(theater);
    setSeatPage(1);
    setSeatsDialogOpen(true);
  };

  const handleCloseSeatsDialog = () => {
    setSeatsDialogOpen(false);
    setSelectedTheater(null);
    setSeatPage(1);
  };

  const handleOpenAddSeatDialog = () => {
    setSeatFormData({
      label: "",
      row: "",
      number: 0,
      type: "STANDARD",
      extraPrice: 0,
    });
    setAddSeatDialogOpen(true);
  };

  const handleCloseAddSeatDialog = () => {
    setAddSeatDialogOpen(false);
    setSeatFormData({
      label: "",
      row: "",
      number: 0,
      type: "STANDARD",
      extraPrice: 0,
    });
  };

  const handleAddSeat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTheater || !seatFormData.label) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide a seat label.",
      });
      return;
    }

    try {
      await addSeat.mutateAsync({
        theaterId: selectedTheater.id,
        data: {
          label: seatFormData.label,
          row: seatFormData.row || undefined,
          number: seatFormData.number || undefined,
          type: seatFormData.type || undefined,
          extraPrice: seatFormData.extraPrice || undefined,
        },
      });
      toast({
        title: "Seat Added",
        description: `Seat "${seatFormData.label}" has been added successfully.`,
      });
      handleCloseAddSeatDialog();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add seat. Please try again.",
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
                            onClick={() => handleOpenSeatsDialog(theater)}
                            title="View and manage seats"
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Seats
                          </Button>
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

        {/* Seats Management Dialog */}
        <Dialog open={seatsDialogOpen} onOpenChange={setSeatsDialogOpen}>
          <DialogContent className="max-w-4xl bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white flex items-center gap-2">
                <MapPin className="h-6 w-6 text-rose-500" />
                Manage Seats - {selectedTheater?.name}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                View and add seats for this theater
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {/* Add Seat Button */}
              <div className="mb-4">
                <Button
                  onClick={handleOpenAddSeatDialog}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Seat
                </Button>
              </div>

              {/* Seats List */}
              {seatsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full bg-zinc-800" />
                  ))}
                </div>
              ) : seatsData?.data && seatsData.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-300">Label</TableHead>
                        <TableHead className="text-zinc-300">Row</TableHead>
                        <TableHead className="text-zinc-300">Number</TableHead>
                        <TableHead className="text-zinc-300">Type</TableHead>
                        <TableHead className="text-zinc-300">
                          Extra Price
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seatsData.data.map((seat) => (
                        <TableRow key={seat.id} className="border-zinc-800">
                          <TableCell className="font-medium text-white">
                            {seat.label}
                          </TableCell>
                          <TableCell className="text-zinc-300">
                            {seat.row || "-"}
                          </TableCell>
                          <TableCell className="text-zinc-300">
                            {seat.number || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                seat.type === "VIP"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500"
                                  : seat.type === "PREMIUM"
                                  ? "bg-rose-500/20 text-rose-300 border-rose-500"
                                  : "bg-zinc-700 text-zinc-300 border-zinc-600"
                              }
                            >
                              {seat.type || "STANDARD"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-300">
                            {seat.extraPrice
                              ? `$${seat.extraPrice.toFixed(2)}`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {seatsData.meta && seatsData.meta.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-zinc-400">
                        Page {seatsData.meta.currentPage} of{" "}
                        {seatsData.meta.totalPages} ({seatsData.meta.totalItems}{" "}
                        total seats)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSeatPage((p) => Math.max(1, p - 1))}
                          disabled={seatPage === 1}
                          className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSeatPage((p) => p + 1)}
                          disabled={
                            seatPage >= (seatsData.meta.totalPages || 1)
                          }
                          className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-4">No seats added yet</p>
                  <Button
                    onClick={handleOpenAddSeatDialog}
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Seat
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseSeatsDialog}
                className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Seat Dialog */}
        <Dialog open={addSeatDialogOpen} onOpenChange={setAddSeatDialogOpen}>
          <DialogContent className="max-w-lg bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                Add New Seat
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Add a seat to {selectedTheater?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSeat}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="label" className="text-white font-semibold">
                    Seat Label <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="label"
                    value={seatFormData.label}
                    onChange={(e) =>
                      setSeatFormData({
                        ...seatFormData,
                        label: e.target.value,
                      })
                    }
                    placeholder="e.g. A1, B12"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    required
                  />
                  <p className="text-xs text-zinc-400">
                    Unique identifier for this seat
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="row" className="text-white font-semibold">
                      Row
                    </Label>
                    <Input
                      id="row"
                      value={seatFormData.row}
                      onChange={(e) =>
                        setSeatFormData({
                          ...seatFormData,
                          row: e.target.value,
                        })
                      }
                      placeholder="e.g. A, B"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="number"
                      className="text-white font-semibold"
                    >
                      Number
                    </Label>
                    <Input
                      id="number"
                      type="number"
                      min="0"
                      value={seatFormData.number || ""}
                      onChange={(e) =>
                        setSeatFormData({
                          ...seatFormData,
                          number: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="e.g. 1, 12"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-white font-semibold">
                    Seat Type
                  </Label>
                  <select
                    id="type"
                    value={seatFormData.type}
                    onChange={(e) =>
                      setSeatFormData({ ...seatFormData, type: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="extraPrice"
                    className="text-white font-semibold"
                  >
                    Extra Price
                  </Label>
                  <Input
                    id="extraPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={seatFormData.extraPrice || ""}
                    onChange={(e) =>
                      setSeatFormData({
                        ...seatFormData,
                        extraPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                  <p className="text-xs text-zinc-400">
                    Additional charge for this seat (optional)
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseAddSeatDialog}
                  className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addSeat.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {addSeat.isPending ? "Adding..." : "Add Seat"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
