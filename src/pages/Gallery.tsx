import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera, X, Play, Filter, Grid3X3, List } from 'lucide-react';

import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import facility1 from '@/assets/facility-1.jpg';
import facility2 from '@/assets/facility-2.jpg';
import facility3 from '@/assets/facility-3.jpg';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  date: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Team Collaboration Session',
    description: 'Our team working together on innovative projects in our modern workspace',
    category: 'Workplace',
    type: 'image',
    url: gallery2,
    thumbnail: gallery2,
    date: '2024-01-20'
  },
  {
    id: '2',
    title: 'Executive Conference Room',
    description: 'State-of-the-art conference facilities for important business meetings',
    category: 'Facilities',
    type: 'image',
    url: facility1,
    thumbnail: facility1,
    date: '2024-01-18'
  },
  {
    id: '3',
    title: 'Innovation Lab Setup',
    description: 'Modern collaboration space designed for creative brainstorming',
    category: 'Innovation',
    type: 'image',
    url: gallery1,
    thumbnail: gallery1,
    date: '2024-01-15'
  },
  {
    id: '4',
    title: 'Open Workspace Design',
    description: 'Contemporary open office layout promoting collaboration and productivity',
    category: 'Workplace',
    type: 'image',
    url: facility2,
    thumbnail: facility2,
    date: '2024-01-12'
  },
  {
    id: '5',
    title: 'Executive Lounge',
    description: 'Premium lounge area for client meetings and networking events',
    category: 'Facilities',
    type: 'image',
    url: facility3,
    thumbnail: facility3,
    date: '2024-01-10'
  }
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = galleryItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Camera className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Media Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our workspace, team activities, and company culture through our visual gallery
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "premium" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'premium' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'masonry' ? 'premium' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('masonry')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'columns-1 md:columns-2 lg:columns-3'
        }`}>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="premium-card overflow-hidden cursor-pointer group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.type === 'video' ? (
                            <div className="glass-card p-4 rounded-full">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          ) : (
                            <div className="glass-card p-4 rounded-full">
                              <Camera className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="absolute top-3 left-3 bg-black/50 text-white"
                      >
                        {item.category}
                      </Badge>
                      {item.type === 'video' && (
                        <div className="absolute top-3 right-3 glass-card p-2 rounded-lg">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>{item.type}</span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                  <div className="relative">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No media found for the selected category.</p>
          </motion.div>
        )}

        {/* Gallery Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="premium-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">150+</div>
                  <div className="text-sm text-muted-foreground">Total Media</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">8</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">25</div>
                  <div className="text-sm text-muted-foreground">Video Content</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">125</div>
                  <div className="text-sm text-muted-foreground">High-Res Images</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;