import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, FileText, Hotel, Car, Plane, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) {
        setError(error.message);
        setBlog(null);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!blog) return <div className="text-center text-gray-500 py-8">Blog not found.</div>;

  const sidebarServices = [
    {
      title: "Apply for Umrah Visa",
      description: "Get your Umrah visa processed quickly",
      icon: FileText,
      link: "/apply",
      color: "emerald"
    },
    {
      title: "Book Hotel",
      description: "Hotels near Haram",
      icon: Hotel,
      link: "/hotel",
      color: "blue"
    },
    {
      title: "Book Transport",
      description: "Reliable transportation",
      icon: Car,
      link: "/transport",
      color: "purple"
    },
    {
      title: "Umrah Packages",
      description: "Complete packages",
      icon: Package,
      link: "/umrah-packages",
      color: "orange"
    }
  ];

  const relatedBlogs = [
    {
      title: "Best Hotels in Makkah: Your Ultimate Guide",
      slug: "best-hotels-makkah-guide",
      date: "2024-12-10"
    },
    {
      title: "Transportation Guide for Umrah Pilgrims",
      slug: "transportation-guide-umrah",
      date: "2024-12-05"
    },
    {
      title: "Essential Duas for Umrah Journey",
      slug: "essential-duas-umrah",
      date: "2024-11-25"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/blog-post" className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article>
              {/* Hero Image */}
              <div className="relative overflow-hidden rounded-2xl mb-8">
                {blog.featured_image && (
                  <img
                    src={blog.featured_image}
                    className="w-full h-64 md:h-96 object-cover"
                    alt={blog.title}
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Article Header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/class="cta-section"/g, 'class="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl my-8 border-l-4 border-emerald-500"')
                    .replace(/class="cta-link"/g, 'class="text-emerald-600 font-semibold hover:text-emerald-700 underline transition-colors"')
                }}
              />

              {/* Author Name at End */}
              <div className="mt-8 text-right text-gray-700 text-base italic">
                Author: {blog.author_name || blog.author || 'Unknown'}
              </div>

              {/* Share Section */}
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Start Your Umrah Journey?</h3>
                  <p className="text-emerald-100 mb-6">
                    Let Marhaba Haji guide you through every step of your sacred pilgrimage
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/apply">
                      <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                        Apply for Umrah Visa
                      </Button>
                    </Link>
                    <Link to="/umrah-packages">
                      <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                        View Packages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Services Cards */}
              <div className="space-y-4">
                {sidebarServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-${service.color}-100`}>
                            <Icon className={`w-5 h-5 text-${service.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                              {service.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {service.description}
                            </p>
                            <Link to={service.link}>
                              <Button size="sm" className="w-full text-xs bg-emerald-600 hover:bg-emerald-700">
                                Get Started
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Related Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedBlogs.map((blog, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                      <Link to={`/blog-post/${blog.slug}`} className="block hover:text-emerald-600 transition-colors">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{blog.title}</h4>
                        <p className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
