
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SiFacebook, SiInstagram } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema for form validation
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  telephone: z.string().min(1, 'Phone number is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface PageContent {
  featured_image_url?: string;
  content?: string;
  published?: boolean;
  title?: string;
}

const Contact = () => {
  const navigate = useNavigate();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      message: ''
    }
  });

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptchaScript = () => {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=6LenGkArAAAAAMbskVWkygp-cJce_b_DJbDA1JIt';
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.body.appendChild(script);
    };

    if (!window.grecaptcha) {
      loadRecaptchaScript();
    } else {
      setRecaptchaLoaded(true);
    }

    return () => {
      // Clean up script if component unmounts
      const script = document.querySelector('script[src="https://www.google.com/recaptcha/api.js?render=6LenGkArAAAAAMbskVWkygp-cJce_b_DJbDA1JIt"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('page_type', 'contact')
          .eq('published', true)
          .maybeSingle();

        if (error) throw error;
        setPageContent(data);
      } catch (error) {
        console.error('Error fetching contact page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();

    const subscription = supabase
      .channel('contact-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages',
          filter: 'page_type=eq.contact'
        },
        (payload: RealtimePostgresChangesPayload<PageContent>) => {
          if (payload.new && (payload.new as PageContent).published) {
            setPageContent(payload.new as PageContent);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);

    try {
      if (!window.grecaptcha) {
        throw new Error("reCAPTCHA not loaded");
      }

      // Execute reCAPTCHA
      const recaptchaToken = await window.grecaptcha.execute('6LenGkArAAAAAMbskVWkygp-cJce_b_DJbDA1JIt', { action: 'contact_submit' });
      
      // Send form data to Edge Function
      const response = await fetch(`https://mhfrtdugboyqejxfdbxj.supabase.co/functions/v1/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          recaptchaToken
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
     {/* Hero Section with Parallax Effect */}
     <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/hero_section/contact_us.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover transform scale-110 animate-[slow-pan_30s_ease-in-out_infinite_alternate]"
            style={{ transformOrigin: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        </div>
       <div className="container-custom relative z-10 text-center text-white py-32">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            Contact Us
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 italic mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
          >
            "We are here to help you with your travel plans"
          </p>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {pageContent && pageContent.content ? (
            <div 
              className="prose prose-lg max-w-none mb-8 quill-content !min-h-0"
              dangerouslySetInnerHTML={{ __html: pageContent.content }} 
            />
          ) : null}
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <p className="mb-6">Feel free to ask a question or simply leave a comment</p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telephone</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments or Questions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="text-xs text-gray-500 mt-2 mb-4">
                      This site is protected by reCAPTCHA v3. By submitting this form, you agree to the Google
                      <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline mx-1">Terms of Service</a>
                      and
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline mx-1">Privacy Policy</a>.
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={submitting || !recaptchaLoaded}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">City Office, Amrit Marg, Thamel, Kathmandu 44600</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+977 985-1120262</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@heritagejourney.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-gray-600">Monday-Friday: 9am - 5pm</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">Connect with us:</h4>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/travelnepalwithheritagejourney/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-heritage-brown/10 hover:bg-heritage-pink text-heritage-brown hover:text-white rounded-full p-2 transition-colors"
                    >
                      <SiFacebook className="h-6 w-6" />
                    </a>
                    <a href="https://www.instagram.com/heritage_journey_nepal/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-heritage-brown/10 hover:bg-heritage-pink text-heritage-brown hover:text-white rounded-full p-2 transition-colors"
                    >
                      <SiInstagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
