import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  Button,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

interface MoveEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
}

export function MoveEquipmentModal({ open, onOpenChange, equipment }: MoveEquipmentModalProps) {
  const [toLocation, setToLocation] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [transferDate, setTransferDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!toLocation || !responsiblePerson || !transferDate) {
      toast.error('Please fill all required fields');
      return;
    }

    toast.success('Equipment movement initiated successfully!');
    onOpenChange(false);
    
    // Reset form
    setToLocation('');
    setResponsiblePerson('');
    setTransferDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            Move Equipment
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Once movement is automatically logged in the audit history. 
                Ensure the <span className="font-semibold">Responsible Person</span> is informed of the transfer details.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="equipment" className="text-sm font-medium">
                Select Equipment
              </Label>
              <Select value={equipment?.id.toString() || ''} disabled>
                <SelectTrigger id="equipment" className="mt-1.5">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={equipment?.id.toString() || '1'}>
                    {equipment?.name || 'EQ-4452 - Caterpillar 320D GC'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-location" className="text-sm font-medium">
                  From Location
                </Label>
                <Input
                  id="from-location"
                  value={equipment?.location || 'Sector Site A'}
                  disabled
                  className="mt-1.5 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="to-location" className="text-sm font-medium">
                  To Location <span className="text-red-500">*</span>
                </Label>
                <Select value={toLocation} onValueChange={setToLocation}>
                  <SelectTrigger id="to-location" className="mt-1.5">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sector-site-b">Sector Site B</SelectItem>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    <SelectItem value="building-c">Building C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="transfer-date" className="text-sm font-medium">
                Date of Transfer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transfer-date"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="responsible-person" className="text-sm font-medium">
                Responsible Person <span className="text-red-500">*</span>
              </Label>
              <Select value={responsiblePerson} onValueChange={setResponsiblePerson}>
                <SelectTrigger id="responsible-person" className="mt-1.5">
                  <SelectValue placeholder="Choose Personnel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="robert-brown">Robert Brown</SelectItem>
                  <SelectItem value="emily-johnson">Emily Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Confirm Movement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
