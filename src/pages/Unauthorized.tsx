import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="premium-card">
          <CardContent className="text-center py-12">
            <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-red-500" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">403</h1>
            <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              You don't have permission to access this resource. 
              Please contact your administrator if you believe this is an error.
            </p>
            
            <div className="space-y-3">
              <Link to="/">
                <Button variant="premium" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
