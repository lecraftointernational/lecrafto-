import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, Eye, RefreshCw, Package, Truck } from "lucide-react";
import { format } from "date-fns";

interface Inquiry {
  id: string;
  order_number: string;
  name: string;
  company: string | null;
  email: string;
  country: string;
  product_interest: string | null;
  moq: number | null;
  message: string;
  status: string;
  order_status: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface TrackingHistory {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  processing: "bg-purple-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Update form
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchInquiries();
    }
  }, [isAdmin]);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch inquiries", variant: "destructive" });
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  const fetchTrackingHistory = async (inquiryId: string) => {
    const { data, error } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("inquiry_id", inquiryId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTrackingHistory(data);
    }
  };

  const openInquiryDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.order_status || "pending");
    setTrackingNumber(inquiry.tracking_number || "");
    setEstimatedDelivery(inquiry.estimated_delivery || "");
    setAdminNotes(inquiry.admin_notes || "");
    setStatusMessage("");
    fetchTrackingHistory(inquiry.id);
    setDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);

    try {
      // Update inquiry
      const { error: updateError } = await supabase
        .from("inquiries")
        .update({
          order_status: newStatus as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
          tracking_number: trackingNumber || null,
          estimated_delivery: estimatedDelivery || null,
          admin_notes: adminNotes || null,
        })
        .eq("id", selectedInquiry.id);

      if (updateError) throw updateError;

      // Add tracking history if status changed
      if (newStatus !== selectedInquiry.order_status || statusMessage) {
        const { error: trackingError } = await supabase
          .from("order_tracking")
          .insert([{
            inquiry_id: selectedInquiry.id,
            status: newStatus as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
            message: statusMessage || `Status updated to ${newStatus}`,
            created_by: user?.id,
          }]);

        if (trackingError) throw trackingError;
      }

      // Send email notification
      try {
        await supabase.functions.invoke("send-order-update", {
          body: {
            email: selectedInquiry.email,
            name: selectedInquiry.name,
            orderNumber: selectedInquiry.order_number,
            status: newStatus,
            trackingNumber: trackingNumber,
            estimatedDelivery: estimatedDelivery,
            message: statusMessage,
          },
        });
      } catch (emailError) {
        console.log("Email notification failed:", emailError);
      }

      toast({ title: "Success", description: "Order updated successfully" });
      setDialogOpen(false);
      fetchInquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Lecrafto International</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={fetchInquiries}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Orders & Inquiries ({inquiries.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>MOQ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-mono text-sm">{inquiry.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{inquiry.name}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{inquiry.country}</TableCell>
                      <TableCell>{inquiry.product_interest || "-"}</TableCell>
                      <TableCell>{inquiry.moq || "-"}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[inquiry.order_status] || "bg-gray-500"} text-white`}>
                          {inquiry.order_status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(inquiry.created_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => openInquiryDetails(inquiry)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>

        {/* Order Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Order: {selectedInquiry?.order_number}
              </DialogTitle>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-6">
                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Name:</span> {selectedInquiry.name}</div>
                  <div><span className="font-semibold">Email:</span> {selectedInquiry.email}</div>
                  <div><span className="font-semibold">Company:</span> {selectedInquiry.company || "-"}</div>
                  <div><span className="font-semibold">Country:</span> {selectedInquiry.country}</div>
                  <div><span className="font-semibold">Product:</span> {selectedInquiry.product_interest || "-"}</div>
                  <div><span className="font-semibold">MOQ:</span> {selectedInquiry.moq || "-"}</div>
                </div>

                <div>
                  <span className="font-semibold">Message:</span>
                  <p className="mt-1 text-muted-foreground bg-muted p-3 rounded">{selectedInquiry.message}</p>
                </div>

                <hr />

                {/* Update Form */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Update Order Status</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Tracking Number</label>
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Estimated Delivery</label>
                    <Input
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status Update Message (sent to customer)</label>
                    <Textarea
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      placeholder="Enter message for customer..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Admin Notes (internal)</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Internal notes..."
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleUpdateOrder} disabled={updating} className="w-full">
                    {updating ? "Updating..." : "Update Order & Notify Customer"}
                  </Button>
                </div>

                <hr />

                {/* Tracking History */}
                <div>
                  <h3 className="font-semibold mb-3">Tracking History</h3>
                  {trackingHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No tracking updates yet</p>
                  ) : (
                    <div className="space-y-2">
                      {trackingHistory.map((track) => (
                        <div key={track.id} className="flex gap-3 text-sm border-l-2 border-primary pl-3 py-1">
                          <Badge className={`${statusColors[track.status]} text-white`}>{track.status}</Badge>
                          <span className="text-muted-foreground">{track.message}</span>
                          <span className="text-muted-foreground ml-auto">
                            {format(new Date(track.created_at), "dd MMM, HH:mm")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Admin;
