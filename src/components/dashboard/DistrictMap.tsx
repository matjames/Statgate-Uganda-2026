import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Users, Shield, MapPin, Activity } from "lucide-react";

interface District {
  id: string;
  name: string;
  activeAgents: number;
  integrityScore: number;
  coords: [number, number];
}

export default function DistrictMap({ districts }: { districts: District[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || districts.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 500;

    // Simplified projection for Uganda
    const projection = d3.geoMercator()
      .center([32.5, 1.5]) // Center of Uganda
      .scale(4200)
      .translate([width / 2, height / 2]);

    // Draw background grid with premium sovereign style lines
    svg.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(d3.range(0, width, 40))
      .enter()
      .append("line")
      .attr("x1", d => d)
      .attr("y1", 0)
      .attr("x2", d => d)
      .attr("y2", height)
      .attr("stroke", "#003366")
      .attr("stroke-opacity", 0.04);

    svg.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(d3.range(0, height, 40))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", d => d)
      .attr("x2", width)
      .attr("y2", d => d)
      .attr("stroke", "#003366")
      .attr("stroke-opacity", 0.04);

    // Draw connections or range rings
    const connections = svg.append("g")
      .attr("class", "connections");

    // Draw district points group
    const points = svg.append("g")
      .selectAll("g")
      .data(districts)
      .enter()
      .append("g")
      .attr("transform", d => {
        const [x, y] = projection([d.coords[1], d.coords[0]]) || [0, 0];
        return `translate(${x}, ${y})`;
      })
      .style("cursor", "pointer");

    // Interactive hover triggers
    points
      .on("mouseenter", function(event, d) {
        const [x, y] = projection([d.coords[1], d.coords[0]]) || [0, 0];
        setHoveredDistrict(d);
        setTooltipPos({ x, y });

        // Highlight pulsed item on hover
        d3.select(this).select(".glow-circle")
          .transition()
          .duration(200)
          .attr("fill", "#00F0FF")
          .attr("fill-opacity", 0.45)
          .attr("r", 16);

        d3.select(this).select(".core-point")
          .transition()
          .duration(150)
          .attr("r", 7)
          .attr("fill", "#D4AF37");
      })
      .on("mousemove", function(event, d) {
        const [x, y] = projection([d.coords[1], d.coords[0]]) || [0, 0];
        setTooltipPos({ x, y });
      })
      .on("mouseleave", function() {
        setHoveredDistrict(null);

        // Reset pulsed item
        d3.select(this).select(".glow-circle")
          .transition()
          .duration(200)
          .attr("fill", "#D4AF37")
          .attr("fill-opacity", 0.2)
          .attr("r", (d: any) => 5 + d.activeAgents / 2);

        d3.select(this).select(".core-point")
          .transition()
          .duration(150)
          .attr("r", 4.5)
          .attr("fill", "#003366");
      });

    // Outer glow circles
    points.append("circle")
      .attr("class", "glow-circle")
      .attr("r", d => 5 + d.activeAgents / 2)
      .attr("fill", "#D4AF37")
      .attr("fill-opacity", 0.2)
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", d => `${5 + d.activeAgents / 2};${10 + d.activeAgents / 2};${5 + d.activeAgents / 2}`)
      .attr("dur", "2.5s")
      .attr("repeatCount", "indefinite");

    // Core points
    points.append("circle")
      .attr("class", "core-point")
      .attr("r", 4.5)
      .attr("fill", "#003366")
      .attr("stroke", "#D4AF37")
      .attr("stroke-width", 1.5);

    // Labels styled nicely
    points.append("text")
      .attr("dy", -16)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-family", "Inter, sans-serif")
      .attr("font-weight", "600")
      .attr("fill", "#003366")
      .text(d => d.name);

    points.append("text")
      .attr("dy", 24)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("fill", "#52525b")
      .text(d => `${d.integrityScore}% ACCURACY`);

  }, [districts]);

  return (
    <div className="relative w-full aspect-[6/5] bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-primary/10 overflow-hidden shadow-sm">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-widest flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-secondary animate-pulse" />
          Geospatial Command Map
        </div>
        <div className="text-sm font-serif text-primary mt-1">Live Sovereignty Telemetry</div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 600 500"
        className="w-full h-full"
      />

      {/* INTERACTIVE FLOATING TOOLTIP */}
      {hoveredDistrict && (
        <div 
          className="absolute z-50 pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-primary/20 p-3.5 rounded-lg shadow-xl shrink-0 w-[190px] transition-all duration-150 ease-out"
          style={{
            left: `${(tooltipPos.x / 600) * 100}%`,
            top: `${(tooltipPos.y / 500) * 100}%`,
            transform: "translate(-50%, -105%)",
          }}
        >
          {/* Decorative corner accent */}
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-r border-b border-primary/20 rotate-45" />

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 border-b border-muted pb-1.5">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <div className="font-serif text-xs font-bold text-primary truncate">
                {hoveredDistrict.name} District
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary/70" />
                  Active Agents:
                </span>
                <span className="font-mono font-bold text-primary">
                  {hoveredDistrict.activeAgents}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary/70" />
                  Integrity Score:
                </span>
                <span className={`font-mono font-bold ${
                  hoveredDistrict.integrityScore >= 98 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-amber-500"
                }`}>
                  {hoveredDistrict.integrityScore}%
                </span>
              </div>
            </div>

            <div className="pt-1 border-t border-muted/50 flex justify-between text-[9px] font-mono text-muted-foreground">
              <span>LAT: {hoveredDistrict.coords[0].toFixed(4)}</span>
              <span>LON: {hoveredDistrict.coords[1].toFixed(4)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/75 dark:bg-slate-900/75 px-2 py-1 rounded-md border border-muted/50 backdrop-blur-sm pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-mono text-primary/60 tracking-wider">SOVEREIGN NETWORK LIVE</span>
      </div>
    </div>
  );
}
