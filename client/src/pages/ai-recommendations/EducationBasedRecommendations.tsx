import React from "react";
import {
  Briefcase,
  GraduationCap,
  CheckCircle,
  Building,
  Users,
  Laptop,
  Heart,
  Camera,
  Utensils,
  Plane,
  BarChart,
  BookOpen,
  FileText,
  TrendingUp,
  Truck,
  Flower,
  Hammer,
  Wrench,
  Smartphone,
  Code,
  Globe,
  Library,
  Radio,
  MessageSquare,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define career path types for different education levels
interface CareerField {
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface CareerAim {
  title: string;
  description: string;
}

interface CareerPathData {
  level: string;
  fields: CareerField[];
  aims: CareerAim[];
  nextSteps: string[];
}

export default function EducationBasedRecommendations() {
  // Career paths data based on education level
  const careerPathsData: CareerPathData[] = [
    {
      level: "10th",
      fields: [
        {
          title: "Polytechnic/Diploma in Engineering",
          icon: <Wrench className="h-4 w-4" />,
          description: "Learn practical engineering skills through diploma courses"
        },
        {
          title: "ITI & Trades",
          icon: <Hammer className="h-4 w-4" />,
          description: "Become an electrician, fitter, welder or other specialized tradesperson"
        },
        {
          title: "Paramedical Technician",
          icon: <Heart className="h-4 w-4" />,
          description: "Support healthcare professionals in hospitals and clinics"
        },
        {
          title: "Graphic Designing",
          icon: <Camera className="h-4 w-4" />,
          description: "Create visual content for digital and print media"
        },
        {
          title: "Retail & Sales",
          icon: <Building className="h-4 w-4" />,
          description: "Join the growing retail sector with entry-level positions"
        },
        {
          title: "Agriculture & Farming Tech",
          icon: <Flower className="h-4 w-4" />,
          description: "Learn modern agricultural techniques and farm management"
        }
      ],
      aims: [
        {
          title: "Junior Technician",
          description: "Support engineers and technical staff in various industries"
        },
        {
          title: "Electrician / Mechanic",
          description: "Specialized trades with high demand in construction and manufacturing"
        },
        {
          title: "Digital Designer",
          description: "Create graphics, layouts and visual elements for various media"
        },
        {
          title: "Data Entry Operator",
          description: "Process and maintain data for organizations across sectors"
        },
        {
          title: "Mobile Technician",
          description: "Repair and maintain smartphones and other mobile devices"
        },
        {
          title: "Farm Assistant",
          description: "Support agricultural operations with modern farming techniques"
        }
      ],
      nextSteps: [
        "Research polytechnic institutions offering diploma courses in your area of interest",
        "Visit local ITI (Industrial Training Institute) centers for information on trade programs",
        "Check eligibility criteria for paramedical courses after 10th standard",
        "Look for short-term certification courses in graphic design or computer applications",
        "Prepare for entrance exams where required for selected courses",
        "Consider attending career fairs to explore apprenticeship opportunities"
      ]
    },
    {
      level: "12th",
      fields: [
        {
          title: "Engineering",
          icon: <Wrench className="h-4 w-4" />,
          description: "Pursue diploma or B.Tech programs in various engineering disciplines"
        },
        {
          title: "Healthcare",
          icon: <Heart className="h-4 w-4" />,
          description: "Become a nursing professional or laboratory technician"
        },
        {
          title: "Hotel Management",
          icon: <Utensils className="h-4 w-4" />,
          description: "Join the hospitality industry with specialized training"
        },
        {
          title: "Aviation",
          icon: <Plane className="h-4 w-4" />,
          description: "Work as cabin crew or ground staff at airports"
        },
        {
          title: "Creative Arts",
          icon: <Camera className="h-4 w-4" />,
          description: "Pursue animation, photography, or other creative fields"
        },
        {
          title: "Business",
          icon: <BarChart className="h-4 w-4" />,
          description: "Start with BBA or banking courses for a business career"
        }
      ],
      aims: [
        {
          title: "Software Tester",
          description: "Verify software quality and functionality for tech companies"
        },
        {
          title: "Nurse Assistant / Lab Technician",
          description: "Support healthcare delivery in hospitals and clinics"
        },
        {
          title: "Hotel Front Office Executive",
          description: "Manage guest relations and front desk operations in hotels"
        },
        {
          title: "Banking Assistant",
          description: "Support financial operations in banks and financial institutions"
        },
        {
          title: "Animation Artist",
          description: "Create animated content for entertainment and advertising"
        },
        {
          title: "Sales Executive",
          description: "Drive business growth through product and service sales"
        }
      ],
      nextSteps: [
        "Research entrance exams for engineering and medical colleges (JEE, NEET)",
        "Explore diploma programs that offer direct entry after 12th",
        "Check requirements for hotel management institute admissions",
        "Prepare for banking or insurance sector entrance exams",
        "Look into BBA and other business program requirements",
        "Consider certification courses in animation or digital media"
      ]
    },
    {
      level: "graduation",
      fields: [
        {
          title: "IT & Software Development",
          icon: <Code className="h-4 w-4" />,
          description: "Build and maintain software applications and systems"
        },
        {
          title: "Digital Marketing",
          icon: <Globe className="h-4 w-4" />,
          description: "Promote brands and products through digital channels"
        },
        {
          title: "Civil Services Preparation",
          icon: <Award className="h-4 w-4" />,
          description: "Prepare for government administrative positions"
        },
        {
          title: "Education",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Become a teacher or educational professional"
        },
        {
          title: "Banking/Finance",
          icon: <BarChart className="h-4 w-4" />,
          description: "Work in financial institutions and banking sector"
        },
        {
          title: "Logistics & Supply Chain",
          icon: <Truck className="h-4 w-4" />,
          description: "Manage the flow of goods and services"
        },
        {
          title: "Law / Legal Assistant",
          icon: <FileText className="h-4 w-4" />,
          description: "Support legal processes in firms and organizations"
        }
      ],
      aims: [
        {
          title: "Software Developer / Web Designer",
          description: "Create applications and websites for various platforms"
        },
        {
          title: "Digital Marketing Executive",
          description: "Plan and execute online marketing campaigns"
        },
        {
          title: "UPSC/State PSC Aspirant",
          description: "Prepare for civil service examinations"
        },
        {
          title: "Bank PO / Clerk",
          description: "Handle banking operations and customer service"
        },
        {
          title: "Content Creator / Copywriter",
          description: "Generate engaging content for brands and publications"
        },
        {
          title: "School Teacher",
          description: "Educate students through B.Ed qualification"
        }
      ],
      nextSteps: [
        "Research master's programs in your field of interest",
        "Prepare for competitive exams like UPSC, banking, or teaching eligibility tests",
        "Look for internships to gain practical experience",
        "Take specialized certification courses to enhance skills",
        "Network with professionals in your target industry",
        "Create a portfolio showcasing your skills and projects"
      ]
    },
    {
      level: "post_graduation",
      fields: [
        {
          title: "Research & Academia",
          icon: <Library className="h-4 w-4" />,
          description: "Conduct research and teach at educational institutions"
        },
        {
          title: "AI/ML & Data Science",
          icon: <Laptop className="h-4 w-4" />,
          description: "Work with artificial intelligence and data technologies"
        },
        {
          title: "Public Policy & Governance",
          icon: <Users className="h-4 w-4" />,
          description: "Influence public administration and policy making"
        },
        {
          title: "Business Consulting",
          icon: <Briefcase className="h-4 w-4" />,
          description: "Advise organizations on business strategies"
        },
        {
          title: "Medical Specialization",
          icon: <Heart className="h-4 w-4" />,
          description: "Pursue advanced medical specialties and research"
        },
        {
          title: "International Opportunities",
          icon: <Globe className="h-4 w-4" />,
          description: "Explore global career paths through GRE, IELTS"
        }
      ],
      aims: [
        {
          title: "Data Scientist / AI Engineer",
          description: "Develop advanced AI systems and analyze complex data"
        },
        {
          title: "Professor / Research Scholar",
          description: "Teach and conduct research at higher education institutions"
        },
        {
          title: "Government Policy Analyst",
          description: "Evaluate and develop public policies and programs"
        },
        {
          title: "HR / Business Consultant",
          description: "Advise organizations on human resources and business strategies"
        },
        {
          title: "Clinical Psychologist",
          description: "Diagnose and treat psychological disorders"
        },
        {
          title: "International Corporate Roles",
          description: "Work in multinational companies across global markets"
        }
      ],
      nextSteps: [
        "Consider PhD programs for academic and research careers",
        "Look for specialized certifications in your field",
        "Build a professional network through industry associations",
        "Research international education and career opportunities",
        "Attend conferences and professional development workshops",
        "Publish research or contribute to professional publications"
      ]
    }
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="mr-2 h-5 w-5 text-primary" />
          Education-Based Career Pathways
        </CardTitle>
        <CardDescription>
          Explore career options based on your current education level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="10th">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="10th">After 10th</TabsTrigger>
            <TabsTrigger value="12th">After 12th</TabsTrigger>
            <TabsTrigger value="graduation">After Graduation</TabsTrigger>
            <TabsTrigger value="post_graduation">After Post-Graduation</TabsTrigger>
          </TabsList>

          {careerPathsData.map((pathData) => (
            <TabsContent key={pathData.level} value={pathData.level}>
              <div className="space-y-6">
                {/* Career Fields Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary-600" />
                    Career Fields
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pathData.fields.map((field, index) => (
                      <Card key={index} className="bg-muted/20">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-md flex items-center">
                            <div className="mr-2 p-1.5 rounded-md bg-primary-50 text-primary-600">
                              {field.icon}
                            </div>
                            {field.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <p className="text-sm text-muted-foreground">{field.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Career Aims Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary-600" />
                    Career Aims
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pathData.aims.map((aim, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">{aim.title}</h4>
                          <p className="text-sm text-muted-foreground">{aim.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary-600" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2">
                    {pathData.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-sm">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}