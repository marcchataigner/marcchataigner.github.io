import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface MinimalTrustCardProps {
  layer: string;
  title: string;
  description: string;
  checkedAudiences: string[];
  impact: string;
  source: string;
}

export function MinimalTrustCard({
  layer,
  title,
  description,
  checkedAudiences,
  impact,
  source,
}: MinimalTrustCardProps) {
  const allAudiences = ["End-user", "Internal User", "Organisation"];
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(checkedAudiences);

  const handleAudienceToggle = (audience: string) => {
    setSelectedAudiences((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience]
    );
  };

  return (
    <Card className="w-full max-w-md shadow-lg border border-border hover:border-primary/30 transition-colors flex flex-col h-full bg-card">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="flex flex-col items-center gap-4">
          <div className="px-6 py-1.5 border-2 border-primary rounded-full">
            <span className="text-primary font-semibold text-xs tracking-widest">{layer.toUpperCase()}</span>
          </div>
          <div className="space-y-3">
            <CardTitle className="text-2xl font-light tracking-tight text-foreground">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0 mt-auto">
        {impact && (
          <div className="space-y-2 p-4 border-l-4 border-primary bg-muted/50">
            <h3 className="font-semibold text-xs uppercase tracking-widest text-foreground">
              Trust Impact
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{impact}</p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-xs uppercase tracking-widest text-foreground">
            Concerned Audience
          </h3>
          <div className="flex flex-col gap-2.5">
            {allAudiences.map((audience) => (
              <div key={audience} className="flex items-center space-x-3 group">
                <Checkbox
                  id={`${title}-${audience}`}
                  checked={selectedAudiences.includes(audience)}
                  onCheckedChange={() => handleAudienceToggle(audience)}
                  className="border-2 border-muted-foreground/40"
                />
                <Label
                  htmlFor={`${title}-${audience}`}
                  className="cursor-pointer select-none text-muted-foreground group-hover:text-foreground transition-colors text-sm"
                >
                  {audience}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {source && (
          <div className="flex items-center justify-center pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Source</span>
              <Badge variant="outline" className="border-primary/40 text-foreground font-normal text-xs">
                {source}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
