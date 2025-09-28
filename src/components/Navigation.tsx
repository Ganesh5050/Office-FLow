import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import { 
  Building2, 
  Users, 
  Package, 
  BarChart3, 
  MapPin, 
  Camera, 
  Archive, 
  Mail, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  LogIn
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Archives', path: '/archives', icon: Archive },
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'Facilities', path: '/facilities', icon: MapPin },
    { name: 'Staff', path: '/staff', icon: Users },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const productItems = [
    { name: 'Registration', path: '/products', icon: Package },
    { name: 'Status', path: '/product-status', icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="glass-card p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">OfficeFlow</h1>
                <p className="text-xs text-muted-foreground">Enterprise Management</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "premium" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              ))}

              {/* Products Dropdown */}
              <div className="relative">
                <Button
                  variant={location.pathname.includes('product') ? "premium" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>

                <AnimatePresence>
                  {isProductsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 w-48 glass-card rounded-xl shadow-premium overflow-hidden"
                    >
                      {productItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsProductsDropdownOpen(false)}
                        >
                          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 dark:hover:bg-slate-900/10 transition-colors">
                            <item.icon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* User Menu / Login Button */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t border-border/50"
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "premium" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              ))}

              <div className="pt-2 border-t border-border/50">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Products</p>
                {productItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "premium" : "ghost"}
                      className="w-full justify-start ml-4"
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-border/50">
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="neomorphic" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Panel
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;