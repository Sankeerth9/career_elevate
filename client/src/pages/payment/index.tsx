import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import { createPayment } from "@/lib/api";
import { packageTypes } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Payment form schema
const paymentSchema = z.object({
  cardName: z.string().min(3, { message: "Card name is required" }),
  cardNumber: z.string().min(16, { message: "Invalid card number" }).max(19),
  expiry: z.string().min(5, { message: "Invalid expiry date (MM/YY)" }).max(5),
  cvc: z.string().min(3, { message: "Invalid CVC" }).max(4),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PackageOption {
  id: string;
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  recommended?: boolean;
}

export default function Payment() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [selectedPackage, setSelectedPackage] = useState<string>("standard");

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });

  // Package options
  const packages: PackageOption[] = [
    {
      id: "basic",
      title: "Basic",
      description: "Essential career guidance tools",
      monthlyPrice: 499,
      yearlyPrice: 4788,
      features: [
        "Career assessment",
        "Basic educational pathways",
        "Limited job listings",
        "Email support",
      ],
    },
    {
      id: "standard",
      title: "Standard",
      description: "Comprehensive career planning",
      monthlyPrice: 999,
      yearlyPrice: 9588,
      features: [
        "Advanced career assessment",
        "Full educational pathways",
        "Complete job listings",
        "Fee calculator",
        "Priority email support",
      ],
      recommended: true,
    },
    {
      id: "premium",
      title: "Premium",
      description: "Complete career development solution",
      monthlyPrice: 1999,
      yearlyPrice: 19188,
      features: [
        "All Standard features",
        "Personalized career counseling session",
        "Interview preparation",
        "Resume review",
        "24/7 priority support",
      ],
    },
  ];

  const selectedPackageDetails = packages.find(pkg => pkg.id === selectedPackage);
  const amount = billingInterval === "monthly" 
    ? selectedPackageDetails?.monthlyPrice 
    : selectedPackageDetails?.yearlyPrice;

  async function onSubmit(data: PaymentFormValues) {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Create payment record
      await createPayment({
        amount,
        packageType: selectedPackage,
        status: "completed", // In a real app, this would be set after payment processing
        transactionId: `TR-${Date.now()}`
      });
      
      toast({
        title: "Payment successful",
        description: `Your ${selectedPackageDetails?.title} package has been activated.`,
      });
      
      navigate("/");
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>{t("payment.title")} | {t("appName")}</title>
      </Helmet>

      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">{t("payment.title")}</h1>

        <div className="flex flex-col space-y-4 items-center mb-8">
          <Tabs 
            defaultValue="monthly" 
            value={billingInterval}
            onValueChange={(value) => setBillingInterval(value as "monthly" | "yearly")}
            className="w-full max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">{t("payment.monthly")}</TabsTrigger>
              <TabsTrigger value="yearly">{t("payment.yearly")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`flex flex-col ${
                pkg.recommended ? "border-primary shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{pkg.title}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-3xl font-bold">
                  ₹{billingInterval === "monthly" ? pkg.monthlyPrice : pkg.yearlyPrice}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    /{billingInterval === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={selectedPackage === pkg.id ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {selectedPackage === pkg.id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter your card information to complete the purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} disabled={isLoading} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} disabled={isLoading} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} disabled={isLoading} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} disabled={isLoading} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <div className="flex justify-between mb-2">
                      <span>Package</span>
                      <span>{selectedPackageDetails?.title}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Billing</span>
                      <span>{billingInterval === "monthly" ? "Monthly" : "Yearly"}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{amount}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      t("payment.checkout")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
