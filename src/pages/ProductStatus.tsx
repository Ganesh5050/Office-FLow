import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Search, Package, Clock, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ProductStatus {
  id: string;
  productName: string;
  status: 'submitted' | 'under-review' | 'approved' | 'in-production' | 'shipped' | 'delivered';
  submissionDate: string;
  lastUpdated: string;
  estimatedDelivery: string;
  progress: number;
  notes: string;
}

const statusConfig = {
  submitted: { label: 'Submitted', color: 'bg-blue-500', icon: Package },
  'under-review': { label: 'Under Review', color: 'bg-yellow-500', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
  'in-production': { label: 'In Production', color: 'bg-purple-500', icon: AlertTriangle },
  shipped: { label: 'Shipped', color: 'bg-indigo-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-500', icon: CheckCircle }
};

const ProductStatus = () => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<ProductStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setSearchResult(null);

    try {
      const response = await apiService.getProductStatus(searchId.trim());
      
      if (response.success && response.data?.product) {
        const product = response.data.product;
        const productStatus: ProductStatus = {
          id: product.productId,
          productName: product.productName,
          status: product.status || 'submitted',
          submissionDate: product.submissionDate || product.createdAt,
          lastUpdated: product.lastUpdated || product.updatedAt,
          estimatedDelivery: product.estimatedDelivery || '',
          progress: product.progress || 0,
          notes: product.notes || ''
        };
        setSearchResult(productStatus);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error searching product:', error);
      setNotFound(true);
      toast({
        title: "Search Error",
        description: "Failed to search for product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const StatusIcon = searchResult ? statusConfig[searchResult.status].icon : Clock;

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
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Product Status Tracker</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track the progress of your registered products in real-time
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span>Search by Registration ID</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="searchId" className="sr-only">Registration ID</Label>
                  <Input
                    id="searchId"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter registration ID (e.g., PR-2024001)"
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="premium" 
                  size="lg"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {searchResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="h-6 w-6 text-primary" />
                      <span>{searchResult.productName}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${statusConfig[searchResult.status].color} text-white`}
                    >
                      {statusConfig[searchResult.status].label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{searchResult.progress}%</span>
                    </div>
                    <Progress value={searchResult.progress} className="h-3" />
                  </div>

                  {/* Status Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Registration ID</Label>
                        <p className="font-mono text-sm bg-muted p-2 rounded">{searchResult.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Submission Date</Label>
                        <p className="text-sm">{new Date(searchResult.submissionDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Last Updated</Label>
                        <p className="text-sm">{new Date(searchResult.lastUpdated).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Estimated Delivery</Label>
                        <p className="text-sm">{new Date(searchResult.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Status Timeline</Label>
                    <div className="space-y-3">
                      {Object.entries(statusConfig).map(([key, config], index) => {
                        const isCompleted = Object.keys(statusConfig).indexOf(searchResult.status) >= index;
                        const isCurrent = searchResult.status === key;
                        const Icon = config.icon;
                        
                        return (
                          <div 
                            key={key} 
                            className={`flex items-center space-x-3 ${
                              isCompleted ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? isCurrent 
                                  ? config.color 
                                  : 'bg-primary' 
                                : 'bg-muted'
                            }`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className={`text-sm ${isCurrent ? 'font-semibold' : ''}`}>
                              {config.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  {searchResult.notes && (
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Status Notes</Label>
                      <div className="glass-card p-4 rounded-xl">
                        <p className="text-sm">{searchResult.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="premium-card">
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No product found with ID "{searchId}". Please check the ID and try again.
                  </p>
                  <Button variant="ghost" onClick={() => setNotFound(false)}>
                    Try Another Search
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Products */}
        {!searchResult && !notFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="premium-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
              <CardHeader>
                <CardTitle className="text-lg">Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Search for any product registration ID from your database:
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>• Enter the exact Product ID (e.g., PR-2024001)</p>
                  <p>• Or use the UUID from the database</p>
                  <p>• All registered products are searchable</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductStatus;