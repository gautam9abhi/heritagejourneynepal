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
      {/* Hero Section — full screen, nothing bleeds through */}
      <div className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background Image */}
        <img
          src="/images/hero_section/contact_us.jpg"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-[slow-pan_30s_ease-in-out_infinite_alternate]"
          style={{ transformOrigin: 'center center' }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/60" />

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/60 mb-4">
            Let's Plan Your Journey
          </p>
          <h1
            className="text-white font-black uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', letterSpacing: '-0.02em' }}
          >
            Contact Us
          </h1>
          <p className="text-white/65 italic tracking-[0.08em] text-base md:text-lg mb-10">
            We are here to help you with your travel plans
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 bg-[#FDFBD4] hover:bg-heritage-orange hover:text-white text-heritage-pink font-bold px-8 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Send a Message →
          </a>
        </div>

        {/* Stats strip — locked to bottom of hero */}
        <div className="relative z-10 bg-heritage-brown flex divide-x divide-white/15">
          {[
            { num: '24/7', label: 'Support' },
            { num: '< 24h', label: 'Response Time' },
            { num: '15+', label: 'Years' },
            { num: '800+', label: 'Happy Travellers' },
          ].map(({ num, label }) => (
            <div key={label} className="flex-1 text-center py-5">
              <div className="text-white font-extrabold text-2xl leading-none mb-1">{num}</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white border-b border-gray-100 px-8 md:px-16 py-4 flex items-center justify-between">
        <span className="text-[9px] font-bold tracking-[0.28em] uppercase text-heritage-orange">
          Get in Touch
        </span>
        <span className="text-xs text-gray-400">
          Scroll down for the form & our details
        </span>
      </div>

      {/* Split panel: info + form */}
      <div id="contact-form" className="flex flex-col md:flex-row overflow-hidden">

        {/* Left panel — info, image-backed */}
        <div className="relative md:w-2/5 min-w-0 min-h-[640px] overflow-hidden">
          <img
            src="/images/hero_section/contact_us.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-heritage-pink/30" />

          <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-14 text-white min-w-0">

            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/45 mb-6">
                Heritage Journey Nepal
              </p>
              <h2
                className="text-4xl md:text-[2.75rem] leading-[1.15] mb-6 !text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Let's talk about<br />your next journey.
              </h2>
              <div className="w-12 h-px bg-heritage-pink mb-7" />
              <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                Whether it's a trek through the Annapurna or a cultural tour of the
                Kathmandu Valley, our team is here to help you plan it.
              </p>
            </div>

            <div className="space-y-5 mt-12">
              <div className="flex items-start gap-4">
                <MapPin className="h-4 w-4 text-heritage-pink shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Address</p>
                  <p className="text-white/85 text-sm">City Office, Amrit Marg, Thamel, Kathmandu 44600</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-4 w-4 text-heritage-pink shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Phone</p>
                  <p className="text-white/85 text-sm">+977 985-1120262</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-4 w-4 text-heritage-pink shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Email</p>
                  <p className="text-white/85 text-sm">info@heritagejourney.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-4 w-4 text-heritage-pink shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Working Hours</p>
                  <p className="text-white/85 text-sm">Monday – Friday, 9am – 5pm</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-12 pt-7 border-t border-white/15">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Follow us</span>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/travelnepalwithheritagejourney/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:border-heritage-pink hover:text-heritage-pink transition-colors"
                >
                  <SiFacebook className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/heritage_journey_nepal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:border-heritage-pink hover:text-heritage-pink transition-colors"
                >
                  <SiInstagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="md:w-3/5 min-w-0 bg-white px-6 md:px-16 py-16 md:py-24 overflow-hidden">
          <div className="w-full max-w-2xl min-w-0">

            {pageContent && pageContent.content ? (
              <div
                className="prose prose-lg max-w-none mb-8 quill-content !min-h-0 break-words [&_*]:max-w-full"
                dangerouslySetInnerHTML={{ __html: pageContent.content }}
              />
            ) : null}

            <p className="text-xs font-bold tracking-[0.3em] uppercase text-heritage-orange mb-4">
              Send a Message
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">We'd love to hear from you</h3>
            <p className="text-gray-500 text-sm mb-10">
              Fill in the details below and a member of our team will be in touch.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane"
                            className="border-0 border-b border-gray-200 rounded-none px-0 py-3 text-base bg-transparent focus-visible:ring-0 focus-visible:border-heritage-pink placeholder:text-gray-300"
                            {...field}
                          />
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
                        <FormLabel className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="border-0 border-b border-gray-200 rounded-none px-0 py-3 text-base bg-transparent focus-visible:ring-0 focus-visible:border-heritage-pink placeholder:text-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          className="border-0 border-b border-gray-200 rounded-none px-0 py-3 text-base bg-transparent focus-visible:ring-0 focus-visible:border-heritage-pink placeholder:text-gray-300"
                          {...field}
                        />
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
                      <FormLabel className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">
                        Telephone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+977 98X XXX XXXX"
                          className="border-0 border-b border-gray-200 rounded-none px-0 py-3 text-base bg-transparent focus-visible:ring-0 focus-visible:border-heritage-pink placeholder:text-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold">
                        Comments or Questions
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about the trip you're dreaming of — dates, group size, interests..."
                          className="min-h-[120px] border-0 border-b border-gray-200 rounded-none px-0 py-3 text-base bg-transparent focus-visible:ring-0 focus-visible:border-heritage-pink placeholder:text-gray-300 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs text-gray-400 leading-relaxed">
                  This site is protected by reCAPTCHA v3. By submitting this form, you agree to the Google
                  <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="underline mx-1">Terms of Service</a>
                  and
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline mx-1">Privacy Policy</a>.
                </p>

                <Button
                  type="submit"
                  className="w-full md:w-auto bg-heritage-pink hover:bg-heritage-orange text-white font-semibold px-10 py-6 rounded-full text-sm"
                  disabled={submitting || !recaptchaLoaded}
                >
                  {submitting ? "Submitting..." : "Send Message →"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;