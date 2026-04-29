
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, AlertTriangle, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface EmergencyNotice {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

const EmergencyNotices = () => {
  const [notices, setNotices] = useState<EmergencyNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<EmergencyNotice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    severity: 'warning' as 'info' | 'warning' | 'critical',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter and cast the data to ensure type safety
      if (data) {
        const typedNotices = data
          .filter(notice => ['info', 'warning', 'critical'].includes(notice.severity))
          .map(notice => ({
            ...notice,
            severity: notice.severity as 'info' | 'warning' | 'critical'
          }));
        
        setNotices(typedNotices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch emergency notices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (notice?: EmergencyNotice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        message: notice.message,
        severity: notice.severity,
        is_active: notice.is_active,
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        message: '',
        severity: 'warning',
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const saveNotice = async () => {
    try {
      setSaving(true);
      
      if (editingNotice) {
        const { error } = await supabase
          .from('emergency_notices')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNotice.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Notice updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('emergency_notices')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Notice created successfully',
        });
      }

      setDialogOpen(false);
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notice',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleNoticeStatus = async (notice: EmergencyNotice) => {
    try {
      const { error } = await supabase
        .from('emergency_notices')
        .update({
          is_active: !notice.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', notice.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Notice ${notice.is_active ? 'deactivated' : 'activated'} successfully`,
      });

      fetchNotices();
    } catch (error) {
      console.error('Error toggling notice status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notice status',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Emergency Notices</h1>
          <Button onClick={() => openEditDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            New Notice
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : notices.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`rounded-lg border p-4 ${
                  notice.is_active
                    ? notice.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : notice.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{notice.title}</h3>
                    <p className="text-sm text-gray-600">{notice.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(notice)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      notice.severity === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : notice.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {notice.severity}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {notice.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={notice.is_active}
                      onCheckedChange={() => toggleNoticeStatus(notice)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No notices</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create an emergency notice to display important information to your visitors.
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNotice ? 'Edit Notice' : 'Create Notice'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter notice title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Enter notice message"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select
                value={formData.severity}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <label className="text-sm font-medium">Active</label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveNotice} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingNotice ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default EmergencyNotices;
