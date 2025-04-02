
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  LoaderIcon, 
  SendIcon, 
  SparklesIcon, 
  ImageIcon,
  BrainCircuitIcon,
  DownloadIcon,
  Share2Icon
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Example presets to help users
  const promptPresets = [
    "A modern minimalist home with large windows and an open floor plan",
    "A cozy cottage with a garden and natural materials",
    "A sustainable eco-friendly house with solar panels and green roof",
    "A luxury penthouse with panoramic city views and smart home features",
    "A beachfront villa with infinity pool and outdoor entertainment areas"
  ];
  
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description of your dream design",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate AI generation (in a real app, this would call an AI API)
    setTimeout(() => {
      // For demo purposes, return a random image from unsplash related to architecture
      const images = [
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
        "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
        "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
        "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e"
      ];
      
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setGeneratedDesign(randomImage);
      setIsLoading(false);
      
      toast({
        title: "Design Generated!",
        description: "Your architectural design has been created successfully.",
      });
    }, 3000);
  };
  
  const handleSelectPreset = (preset: string) => {
    setPrompt(preset);
  };
  
  const handleClear = () => {
    setPrompt('');
    setGeneratedDesign(null);
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <SparklesIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Design Generator</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Describe your dream home or architectural concept, and let our AI visualize it for you.
          </p>
        </div>
        
        <Tabs defaultValue="text-to-image" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text-to-image" className="flex items-center gap-2">
              <BrainCircuitIcon className="h-4 w-4" />
              Text to Image
            </TabsTrigger>
            <TabsTrigger value="style-transfer" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Style Transfer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text-to-image">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <Label htmlFor="prompt" className="text-base mb-2 block">Describe your dream design</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., A modern minimalist house with large windows, surrounded by nature, with an open floor plan and sustainable materials"
                    className="resize-none h-32 mb-2"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about architectural style, materials, features, and surroundings.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="style" className="mb-2 block">Architectural Style</Label>
                    <Select defaultValue="modern">
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="scandinavian">Scandinavian</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="contemporary">Contemporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="viewpoint" className="mb-2 block">Viewpoint</Label>
                    <Select defaultValue="exterior">
                      <SelectTrigger id="viewpoint">
                        <SelectValue placeholder="Select viewpoint" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exterior">Exterior</SelectItem>
                        <SelectItem value="interior">Interior</SelectItem>
                        <SelectItem value="aerial">Aerial View</SelectItem>
                        <SelectItem value="perspective">Perspective View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Try a prompt preset:</p>
                  <div className="flex flex-wrap gap-2">
                    {promptPresets.map((preset, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectPreset(preset)}
                      >
                        {preset.split(' ').slice(0, 3).join(' ')}...
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button 
                    className="flex-1"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                  >
                    {isLoading ? (
                      <>
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        Generate Design
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="style-transfer">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center p-8">
                  <h3 className="text-xl font-medium mb-2">Coming Soon!</h3>
                  <p className="text-muted-foreground mb-4">
                    Our style transfer feature will let you upload your home and see it in different architectural styles.
                  </p>
                  <Button variant="outline" disabled>Upload Image</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Results Section */}
        {generatedDesign && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Your Generated Design</h2>
            
            <div className="bg-muted/30 rounded-xl p-6 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Prompt</h3>
                <p className="text-muted-foreground text-sm">{prompt}</p>
              </div>
              
              <div className="rounded-lg overflow-hidden border mb-6">
                <img
                  src={generatedDesign}
                  alt="AI Generated Architectural Design"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="sm:flex-1" variant="default">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
                <Button className="sm:flex-1" variant="outline">
                  <Share2Icon className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button className="sm:flex-1" variant="secondary">
                  <SendIcon className="mr-2 h-4 w-4" />
                  Find Similar Architects
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Not happy with the result? Generate a new design or refine your prompt.</p>
              <Button onClick={handleGenerate} disabled={isLoading}>
                Generate Another Design
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
