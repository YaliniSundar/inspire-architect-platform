import { useState, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadIcon, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface UploadDesignProps {
  onUploadSuccess?: (design: any) => void;
  children?: ReactNode;
}

const UploadDesign = ({ onUploadSuccess, children }: UploadDesignProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      image: null as any,
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setSelectedImage(null);
    form.setValue('image', null);
  };
  
  const onSubmit = async (data: any) => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please upload an image for your design.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Convert tags string to array
      const tagsArray = data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      
      // Mock successful upload
      setTimeout(() => {
        const newDesign = {
          id: `design-${Date.now()}`,
          title: data.title,
          description: data.description,
          tags: tagsArray,
          imageUrl: selectedImage,
          likes: 0,
          saves: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
        };
        
        if (onUploadSuccess) {
          onUploadSuccess(newDesign);
        }
        
        setIsUploading(false);
        setOpen(false);
        
        toast({
          title: "Design Uploaded",
          description: "Your design has been successfully uploaded.",
        });
        
        // Reset form
        form.reset();
        setSelectedImage(null);
      }, 1500);
      
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your design. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Upload New Design</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Design</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Modern Minimalist House" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your design..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Modern, Minimalist, Residential" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Design Image</Label>
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Selected design" 
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center">
                  <UploadIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop an image or click to browse</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Design'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDesign;
