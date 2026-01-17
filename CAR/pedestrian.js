class Pedestrian {
    constructor(unused1, unused2, crossing) {
        this.crossing = crossing;
        this.size = 8;
        this.speed = 0.8;
        
        // Calculate crossing start and end points (extend beyond road borders)
        const perp = perpendicular(crossing.directionVector);
        const offset = crossing.width / 2 + 80; // Extra 80 units beyond road to fully clear it
        
        // Start/end are far outside the road
        this.startPoint = add(crossing.center, scale(perp, offset), false);
        this.endPoint = add(crossing.center, scale(perp, -offset), false);
        
        // Edge positions - breadth-wise centered, at the edges of crossing lengthwise
        // Use crossing.directionVector to position along the crossing, perpendicular for width
        const edgeOffset = crossing.width / 2; // Distance from center to edge along crossing direction
        this.edgeStart = add(crossing.center, scale(perp, edgeOffset), false);
        this.edgeEnd = add(crossing.center, scale(perp, -edgeOffset), false);
        
        // Off-road positions (beyond the road)
        this.offRoadStart = add(crossing.center, scale(perp, edgeOffset + 30), false);
        this.offRoadEnd = add(crossing.center, scale(perp, -edgeOffset - 30), false);
        
        // State management
        this.state = "waiting_at_edge"; // "waiting_at_edge", "crossing", "waiting_at_other_side"
        this.direction = Math.random() > 0.5 ? 1 : -1; // 1 = start to end, -1 = end to start
        this.progress = this.direction > 0 ? 0 : 1; // Start at appropriate edge
        this.waitTime = 0;
        this.readyToReturn = false;
        this.detectionRadius = 150; // How far to check for cars
        this.carStoppedTime = 0; // Track how long car has been stopped
        this.requiredStopTime = 100; // Only 100ms needed - faster crossing
        
        // Initialize position properly
        this.x = 0;
        this.y = 0;
        this.updatePosition();
    }
    
    updatePosition() {
        if (this.state === "waiting_at_other_side") {
            // Position off the road when waiting after crossing
            if (this.direction > 0) {
                this.x = this.offRoadEnd.x;
                this.y = this.offRoadEnd.y;
            } else {
                this.x = this.offRoadStart.x;
                this.y = this.offRoadStart.y;
            }
        } else if (this.state === "waiting_at_edge") {
            // Position OFF the road when waiting to cross (not on the road)
            if (this.direction > 0) {
                this.x = this.offRoadStart.x;
                this.y = this.offRoadStart.y;
            } else {
                this.x = this.offRoadEnd.x;
                this.y = this.offRoadEnd.y;
            }
        } else {
            // Crossing - interpolate from one edge to the other (across the road)
            this.x = lerp(this.edgeStart.x, this.edgeEnd.x, this.progress);
            this.y = lerp(this.edgeStart.y, this.edgeEnd.y, this.progress);
        }
    }
    
    checkCarsStoppedNearby(cars) {
        // Check if any car is nearby and fully stopped
        let carNearby = false;
        let carFullyStopped = false;
        
        for (const car of cars) {
            const dist = Math.sqrt(
                Math.pow(car.x - this.x, 2) + 
                Math.pow(car.y - this.y, 2)
            );
            
            // Car must be within 200 units for pedestrian to consider crossing
            if (dist < 200) {
                carNearby = true;
                // Very relaxed - car just needs to be slow (< 0.5)
                if (Math.abs(car.speed) < 0.5) {
                    carFullyStopped = true;
                    break;
                }
            }
        }
        
        // If car is nearby and stopped, track how long it's been stopped
        if (carNearby && carFullyStopped) {
            this.carStoppedTime += 16; // Add frame time
            return this.carStoppedTime >= this.requiredStopTime;
        } else {
            this.carStoppedTime = 0; // Reset if car moves or leaves
            return false;
        }
    }
    
    checkIfSafeToCross(cars) {
        // Check if any car is too close or moving toward the crossing
        for (const car of cars) {
            const dist = Math.sqrt(
                Math.pow(car.x - this.x, 2) + 
                Math.pow(car.y - this.y, 2)
            );
            
            // If a car is very close and moving, stop crossing immediately
            if (dist < this.detectionRadius && Math.abs(car.speed) > 0.1) {
                return false;
            }
        }
        return true;
    }
    
    update(cars) {
        if (this.state === "waiting_at_edge") {
            // Wait at the edge until a car stops nearby for sufficient time
            if (this.checkCarsStoppedNearby(cars)) {
                this.state = "crossing";
                this.carStoppedTime = 0; // Reset for next crossing
            }
        } else if (this.state === "crossing") {
            // Move along the crossing continuously - don't stop mid-crossing
            this.progress += this.speed * this.direction * 0.01;
            
            // Check if reached the other side
            if (this.direction > 0 && this.progress >= 1) {
                this.progress = 1;
                this.state = "waiting_at_other_side";
                this.waitTime = 0;
            } else if (this.direction < 0 && this.progress <= 0) {
                this.progress = 0;
                this.state = "waiting_at_other_side";
                this.waitTime = 0;
            }
            
            this.updatePosition();
        } else if (this.state === "waiting_at_other_side") {
            // Wait at the other side before being ready to return
            this.waitTime += 16;
            
            if (this.waitTime >= 10000) { // Wait 10 seconds before returning
                this.readyToReturn = true;
                this.state = "waiting_at_edge";
                this.direction = -this.direction; // Reverse direction for next crossing
            }
            
            // Update position to be off the road
            this.updatePosition();
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw simple pedestrian as circle
        // Different color based on state
        if (this.state === "waiting_at_edge") {
            ctx.fillStyle = "#D2691E"; // Brown when waiting
        } else if (this.state === "crossing") {
            ctx.fillStyle = "#333"; // Dark when crossing
        } else {
            ctx.fillStyle = "#8B4513"; // Different brown when at other side
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a white outline for visibility
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
    
    getPolygon() {
        // Return collision polygon when waiting at edge OR crossing
        // This allows cars to detect and stop for waiting/crossing pedestrians
        // Only remove collision when pedestrian is completely off the road
        if (this.state === "waiting_at_other_side") {
            return []; // No collision when waiting off the road
        }
        
        // Return collision polygon for both waiting and crossing states
        if (this.state === "waiting_at_edge" || this.state === "crossing") {
            const rad = this.size * 4; // Moderate collision box (4x size) for accurate detection
            return [
                new Point(this.x - rad, this.y - rad),
                new Point(this.x + rad, this.y - rad),
                new Point(this.x + rad, this.y + rad),
                new Point(this.x - rad, this.y + rad)
            ];
        }
        
        return [];
    }
}
