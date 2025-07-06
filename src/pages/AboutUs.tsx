import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "../components/AnimatedCounter";

const AboutUs = () => {
  const achievements = [
    {
      number: 1000,
      suffix: "+",
      label: "Pilgrims Served",
      icon: "🕋",
    },
    {
      number: 99,
      suffix: "%",
      label: "Success Rate",
      icon: "✅",
    },
    {
      number: 15,
      suffix: "+",
      label: "Years Experience",
      icon: "🏆",
    },
    {
      number: 25,
      suffix: "+",
      label: "Countries Served",
      icon: "🌍",
    },
  ];

  const certifications = [
    {
      title: "IATA Certified",
      description:
        "International Air Transport Association certification for travel services",
      icon: "🏆",
      authority: "IATA Global",
    },
    {
      title: "Saudi Umrah Visa Licensed",
      description:
        "Official license from Ministry of Hajj and Umrah, Saudi Arabia",
      icon: "🕋",
      authority: "Ministry of Hajj & Umrah",
    },
    {
      title: "Ministry Approved",
      description: "Recognized by Indian Ministry of Minority Affairs",
      icon: "🏛️",
      authority: "Govt. of India",
    },
    {
      title: "Karnataka Tourism Certified",
      description: "State government certification for tourism services",
      icon: "🌟",
      authority: "Karnataka Tourism",
    },
  ];

  const milestones = [
    {
      year: "2008",
      title: "Company Founded",
      description:
        "Marhaba Ventures Private Limited established with a vision to serve pilgrims worldwide",
    },
    {
      year: "2012",
      title: "IATA Certification",
      description:
        "Received IATA certification, expanding our global reach and credibility",
    },
    {
      year: "2015",
      title: "Saudi License",
      description:
        "Obtained official Umrah visa processing license from Saudi Ministry",
    },
    {
      year: "2018",
      title: "25,000 Pilgrims",
      description:
        "Crossed milestone of serving 25,000+ pilgrims with successful visa processing",
    },
    {
      year: "2021",
      title: "Digital Transformation",
      description:
        "Launched online platform for seamless digital visa application process",
    },
    {
      year: "2024",
      title: "50,000+ Pilgrims",
      description: "Proudly serving over 50,000 pilgrims with 99% success rate",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-emerald-100 text-emerald-800 mb-6 px-4 py-2 text-sm font-medium">
              🕋 About Marhaba Haji
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Trusted Partner for Sacred Journeys
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              For over 15 years, Marhaba Ventures Private Limited has been at
              the forefront of providing exceptional Umrah and pilgrimage
              services to Muslims worldwide. We are committed to making your
              sacred journey seamless, affordable, and spiritually fulfilling.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  <AnimatedCounter
                    end={achievement.number}
                    suffix={achievement.suffix}
                  />
                </div>
                <p className="text-gray-600 font-medium">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story & Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2008, Marhaba Ventures Private Limited began with a
                simple yet profound mission: to make the sacred journey of Umrah
                accessible, affordable, and hassle-free for Muslims around the
                world.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Under the visionary leadership of our founder, we have grown
                from a small local agency to a globally recognized Umrah service
                provider, serving pilgrims from over 25 countries with our
                comprehensive visa processing and travel services.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our commitment to excellence has earned us multiple
                certifications and the trust of over 50,000 pilgrims who have
                successfully completed their spiritual journey with our
                assistance.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                Start Your Journey
              </Button>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/926a16d2-5686-4f5e-824d-cba03262d8d3.png"
                alt="Marhaba Haji Services"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Licenses */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Licensed & Certified Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our credentials speak for our commitment to providing authentic,
              reliable, and legally compliant services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{cert.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {cert.title}
                      </CardTitle>
                      <p className="text-sm text-emerald-600 font-medium">
                        {cert.authority}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey Through the Years
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A timeline of growth, achievements, and milestones in our mission
              to serve the global Muslim community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center mb-12 last:mb-0">
                <div className="flex-shrink-0 w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {milestone.year}
                </div>
                <div className="ml-8 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Pilgrims Choose Marhaba Haji
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence and customer satisfaction sets us
              apart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🌟</span>
                </div>
                <CardTitle>Unmatched Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  15+ years of expertise in Umrah services with deep
                  understanding of pilgrimage requirements and cultural
                  sensitivities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <CardTitle>Guaranteed Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  99% visa approval rate backed by our expertise and strong
                  relationships with Saudi authorities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💬</span>
                </div>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Round-the-clock customer support in multiple languages to
                  assist you throughout your journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
