"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subscriptionFee: z.enum(["0.5", "1"], {
    required_error: "Please select a subscription fee.",
  }),
});

function SignUpForm() {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subscriptionFee: "0.5",
    },
  });

  const createPaymentIntent = async (subscriptionFee: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionFee }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      toast({
        title: "Error",
        description: "Failed to set up payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createPaymentIntent(form.getValues('subscriptionFee'));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!stripe || !elements || !clientSecret) {
      toast({
        title: "Error",
        description: "Payment system is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: values.name,
          email: values.email,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent.status === 'succeeded') {
      toast({
        title: "Success",
        description: "Your subscription has been set up successfully!",
      });
      // Here you would typically send the form data to your server
      console.log(values, paymentIntent);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Fee</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  createPaymentIntent(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subscription fee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0.5">€0.50 / month</SelectItem>
                  <SelectItem value="1">€1.00 / month</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Credit Card</FormLabel>
          <FormControl>
            <CardElement />
          </FormControl>
        </FormItem>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
      <Elements stripe={stripePromise}>
        <SignUpForm />
      </Elements>
    </div>
  );
}