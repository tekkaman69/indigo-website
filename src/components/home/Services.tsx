import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '../ui/card';
import { SectionHeader } from '../ui/SectionHeader';
import { services } from '@/data/services';

const Services = () => {
  return (
    <section id="services" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader title="Nos Piliers de Création" description="De l'idée à la réalité, nous couvrons tous les aspects de votre communication digitale avec expertise et passion." />
        <Tabs defaultValue="automations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-transparent p-0">
            {services.map((service) => (
              <TabsTrigger
                key={service.value}
                value={service.value}
                className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-lg h-full flex flex-col items-center justify-center gap-2 p-4 border border-transparent hover:bg-card/50 rounded-lg transition-all text-muted-foreground"
              >
                <service.icon className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold">{service.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {services.map((service) => (
            <TabsContent key={service.value} value={service.value} className="mt-8">
              <Card>
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="max-w-md">
                      <h3 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-3">
                        <service.icon className="w-7 h-7" /> {service.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Services;
