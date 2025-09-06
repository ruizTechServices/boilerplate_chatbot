import React from 'react';

export default function Description() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Jumpstart Your Chatbot Project
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Launch your next conversational AI with our robust chatbot boilerplate. 
            Save time, streamline development, and focus on building unique experiences for your users.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="group p-8 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <div className="w-6 h-6 bg-primary rounded-sm"></div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Ready to Deploy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get started instantly with a pre-configured chatbot template. 
              Deploy to your favorite platform in minutes, not days.
            </p>
          </div>
          
          <div className="group p-8 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <div className="w-6 h-6 bg-primary rounded-sm"></div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Customizable & Extensible</h3>
            <p className="text-muted-foreground leading-relaxed">
              Easily adapt the chatbot to your needs. Add new features, integrate APIs, 
              and personalize the conversation flow with minimal effort.
            </p>
          </div>
          
          <div className="group p-8 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <div className="w-6 h-6 bg-primary rounded-sm"></div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Secure & Reliable</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built with best practices for security and reliability. 
              Your conversations and data are protected from day one.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-sm font-medium text-primary">🤖 Used by developers worldwide</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a growing community of developers building smarter chatbots faster. 
            From prototypes to production, our boilerplate scales with your project.
          </p>
        </div>
      </div>
    </section>
  );
}
