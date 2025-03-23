import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Fixed import with absolute path
import { toast } from 'react-hot-toast'; // Changed back to named import

interface GetStartedButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  href?: string;
}

export function GetStartedButton({
  className,
  variant = 'default',
  size = 'default',
  href,
}: GetStartedButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Show notification to the user
    toast.success(
      "Thank you for your interest! This feature is still a work in progress. We'll notify you when it's ready.",
      {
        duration: 5000,
      }
    );
    
    // If href is provided, don't prevent default navigation
    if (!href) {
      e.preventDefault();
    }
  };

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={handleClick}
      {...(href ? { href } : {})}
    >
      Get Started
    </Button>
  );
}
