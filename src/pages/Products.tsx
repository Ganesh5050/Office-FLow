import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Package, Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { apiService } from '@/services/api';

const Products = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    description: '',
    email: '',
    documents: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('productId', formData.productId);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('email', formData.email);
      
      if (formData.documents) {
        formDataToSend.append('documents', formData.documents);
      }

      const response = await apiService.registerProduct(formDataToSend);
      
      if (response.success) {
        toast({
          title: "Product Registration Successful!",
          description: `Product "${formData.productName}" has been registered with ID: ${response.data?.product?.productId || 'Auto-generated'}`,
        });
        
        setFormData({
          productName: '',
          productId: '',
          description: '',
          email: '',
          documents: null
        });
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Failed to register product. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Product registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to register product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, documents: file }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Product Registration</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Register your products with our comprehensive management system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Registration Form</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                      placeholder="Enter product name"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productId">Product ID (Optional)</Label>
                    <Input
                      id="productId"
                      value={formData.productId}
                      onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                      placeholder="Leave blank for auto-generation"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your product..."
                      rows={4}
                      className="rounded-xl resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documents">Upload Documents</Label>
                    <div className="glass-card p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                      <input
                        id="documents"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        className="hidden"
                      />
                      <label htmlFor="documents" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.documents ? formData.documents.name : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="premium" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Register Product
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Process Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Registration Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Submit Registration</h4>
                    <p className="text-sm text-muted-foreground">Fill out the form with your product details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Review Process</h4>
                    <p className="text-sm text-muted-foreground">Our team reviews your submission within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Confirmation</h4>
                    <p className="text-sm text-muted-foreground">Receive confirmation and tracking ID via email</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Important Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• All fields marked with * are mandatory</p>
                <p>• Product IDs are automatically generated if not provided</p>
                <p>• Supported file formats: PDF, DOC, DOCX, JPG, PNG</p>
                <p>• Maximum file size: 10MB per upload</p>
                <p>• You will receive email notifications about your registration status</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Products;