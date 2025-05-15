import React from 'react';

// Define types for the guide content structure
interface ActionableStep {
  title: string;
  description: string;
  iconName?: string;
}

interface GuideContent {
  greeting: string;
  keyStrengths: string[];
  areasToFocus: string[];
  actionableSteps: ActionableStep[];
  conversationStarters: string[];
  closingRemark: string;
}

interface GuideEmailTemplateProps {
  guideContent: GuideContent;
  userName: string;
}

const GuideEmailTemplate: React.FC<GuideEmailTemplateProps> = ({ guideContent, userName }) => {
  // Inline styles object for email compatibility
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      color: '#333333',
      backgroundColor: '#ffffff',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '30px',
    },
    title: {
      color: '#FF6B6B',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    subtitle: {
      color: '#4D96FF',
      fontSize: '18px',
      marginBottom: '20px',
    },
    section: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      paddingBottom: '5px',
      borderBottom: '2px solid #f0f0f0',
    },
    strengthsTitle: {
      color: '#6BCB77',
    },
    focusTitle: {
      color: '#4D96FF',
    },
    stepsTitle: {
      color: '#FFA93A',
    },
    conversationTitle: {
      color: '#FF6B6B',
    },
    list: {
      paddingLeft: '20px',
      margin: '10px 0',
    },
    listItem: {
      marginBottom: '8px',
    },
    step: {
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#ffffff',
      borderLeft: '3px solid #FFA93A',
    },
    stepTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '5px',
    },
    stepDescription: {
      fontSize: '14px',
      color: '#555555',
    },
    conversationStarter: {
      padding: '10px',
      backgroundColor: '#ffffff',
      borderRadius: '5px',
      marginBottom: '10px',
      fontStyle: 'italic',
      borderLeft: '3px solid #FF6B6B',
    },
    closingSection: {
      marginTop: '30px',
      padding: '15px',
      backgroundColor: '#f0f7ff',
      borderRadius: '5px',
    },
    closingTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '10px',
    },
    closingText: {
      fontStyle: 'italic',
      color: '#555555',
    },
    footer: {
      marginTop: '30px',
      textAlign: 'center' as const,
      fontSize: '14px',
      color: '#999999',
      padding: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Personalized Coffee-Chat Guide</h1>
        <p style={styles.subtitle}>Prepared exclusively for {userName}</p>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '25px', fontSize: '16px' }}>
        {guideContent.greeting}
      </div>

      {/* Key Strengths */}
      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, ...styles.strengthsTitle }}>
          Your Key Strengths
        </h2>
        <ul style={styles.list}>
          {guideContent.keyStrengths.map((strength, index) => (
            <li key={index} style={styles.listItem}>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Areas to Focus */}
      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, ...styles.focusTitle }}>
          Areas to Focus On
        </h2>
        <ul style={styles.list}>
          {guideContent.areasToFocus.map((area, index) => (
            <li key={index} style={styles.listItem}>
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Actionable Steps */}
      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, ...styles.stepsTitle }}>
          Your Action Plan
        </h2>
        {guideContent.actionableSteps.map((step, index) => (
          <div key={index} style={styles.step}>
            <h3 style={styles.stepTitle}>
              {index + 1}. {step.title}
            </h3>
            <p style={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>

      {/* Conversation Starters */}
      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, ...styles.conversationTitle }}>
          Conversation Starters
        </h2>
        {guideContent.conversationStarters.map((starter, index) => (
          <div key={index} style={styles.conversationStarter}>
            "{starter}"
          </div>
        ))}
      </div>

      {/* Closing Remark */}
      <div style={styles.closingSection}>
        <h2 style={styles.closingTitle}>Final Thoughts</h2>
        <p style={styles.closingText}>{guideContent.closingRemark}</p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>Powered by Coffee-Chat Coach</p>
        <p>© {new Date().getFullYear()} Coffee-Chat Coach. All rights reserved.</p>
      </div>
    </div>
  );
};

export default GuideEmailTemplate;
