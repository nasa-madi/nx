


import { BasePlugin } from 'madi-plg-base-class'

const TOOLNAME = 'trend-card'

export class Plugin extends BasePlugin {


  constructor(options) {
    super({
      ...options,
      description
    })
  }


  async run() {
    return {content: trendCardPrompt}
  }
}


export const description = {
  type: 'function',
  plugin: 'CAS Discovery',
  display: 'Trend Card Generator',
  function: {
    name: TOOLNAME,
    description: 'Generate a Trend Card for CAS Fundamental Units Deliverables project. A trend is defined as an emerging direction in which some aspect of PESTELE is developing or changing.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the trend or capability being analyzed'
        },
        domain: {
          type: 'string',
          description: 'The primary PESTELE domain this trend belongs to (Political, Economic, Social, Technological, Environmental, Legal, or Ethical)',
          enum: ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal', 'Ethical']
        },
        timeframe: {
          type: 'string',
          description: 'Expected timeline for the trend (e.g., "3-5 years", "5-10 years")'
        }
      },
      required: ['title', 'domain', 'timeframe']
    }
  }
};

const trendCardPrompt = `
A trend card is part of the Fundamental Units Deliverables project at CAS (Convergent Aeronautics Solutions). A trend is defined as an emerging direction in which some aspect of PESTELE is developing or changing.

Please analyze the information provided by the user in the conversation above and create a detailed trend card using the following format.

Please consider all aspects of PESTELE (Political, Economic, Social, Technological, Environmental, Legal, and Ethical) in your analysis. Focus on emerging directions and changes that could impact aeronautics and related fields.

All information should be analyzed through NASA's perspective, considering opportunities for positive societal impact and potential transformative technologies.


## Example Trend Card
\`\`\`
# TITLE: 
Trend/Capability: Sensor & Data Fusion

## OVERVIEW: 
There is a growing trend toward sensor and data fusion, using multiple sensors (cameras, radar, LiDAR, GPS, IMUs, etc.) to produce more consistent, accurate, and useful information than would be possible from any single sensor alone. 

## IMPLICATIONS: 
By processing data from different sensors, systems can correct for individual sensor weaknesses, leading to more reliable outcomes. Sensor fusion can enhance situational awareness by providing comprehensive environmental insights, crucial for applications like autonomous vehicles, robotics, and drones.

## OPPORTUNTIES + THREATS:
*Opportunities:* 
 - Increasingly accurate and automated perception
*Threats:*
 - Road and airspace congestion; 
 - Potential loss of driving jobs; 
 - Potential accidents and threats to property or human life.

## KEY STAKEHOLDERS:
- Regulatory bodies
- Sensor and autonomous nav industries
- Truck drivers, taxi drivers, etc.

## PROJECTED TIMELINE RANGE: 
3-5 years, with a peak around 2028

## EXAMPLE:
 - Sensor fusion in autonomous cars, e.g., Waymo.
\`\`\`





## Template for Trend Card

\`\`\`
 # TITLE
 [Trend/Capability Name]
 
 ## OVERVIEW
 [Provide a clear, concise description of the trend and its significance]
 
 ## IMPLICATIONS
 [Describe the potential impacts and consequences of this trend]
 
 ## OPPORTUNITIES + THREATS
 [List key opportunities and potential threats]
 
 ## KEY STAKEHOLDERS
 [Identify important stakeholders affected by or involved in this trend]
 
 ## PROJECTED TIMELINE RANGE
 [Specify the expected timeline for this trend's development]
 
 ## EXAMPLE
 [Provide a concrete example of this trend in action]
\`\`\`

`;