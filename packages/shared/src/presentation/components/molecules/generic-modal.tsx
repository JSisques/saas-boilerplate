'use client';

import * as React from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/shared/presentation/components/ui/dialog';
import { Button } from '@repo/shared/presentation/components/ui/button';
import { cn } from '@repo/shared/presentation/lib/utils';

export type GenericModalAction = {
	label: string;
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
	isLoading?: boolean;
	disabled?: boolean;
	onClick?: () => void | Promise<void>;
	type?: 'button' | 'submit' | 'reset';
};

export type GenericModalProps = {
	title: React.ReactNode;
	description?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	trigger?: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/**
	 * Footer primary/confirm action (right-most).
	 * Omit to hide the footer entirely.
	 */
	primaryAction?: GenericModalAction;
	/**
	 * Footer secondary/cancel action (left of primary).
	 */
	secondaryAction?: GenericModalAction;
	/**
	 * Hide the footer section.
	 */
	hideFooter?: boolean;
	/**
	 * Hide the header section.
	 */
	hideHeader?: boolean;
	/**
	 * Custom content to render in the footer. If provided, it replaces the default footer actions.
	 */
	footerContent?: React.ReactNode;
	/**
	 * Size utility classes to adjust the max width if needed.
	 * Defaults to `sm:max-w-lg`.
	 */
	contentClassName?: string;
};

/**
 * A generic, opinionated modal built on top of Radix Dialog primitives,
 * exposed via our shared UI `Dialog` components.
 */
export function GenericModal({
	title,
	description,
	children,
	className,
	trigger,
	open,
	defaultOpen,
	onOpenChange,
	primaryAction,
	secondaryAction,
	hideFooter,
	hideHeader,
	footerContent,
	contentClassName,
}: GenericModalProps) {
	const contentClasses = cn('sm:max-w-lg', contentClassName);

	return (
		<Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
			{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
			<DialogContent className={cn(contentClasses, className)}>
				{!hideHeader ? (
					<DialogHeader>
						{title ? <DialogTitle>{title}</DialogTitle> : null}
						{description ? (
							<DialogDescription>{description}</DialogDescription>
						) : null}
					</DialogHeader>
				) : null}

				{children}

				{hideFooter
					? null
					: footerContent ?? (
							<DialogFooter>
								{secondaryAction ? (
									<Button
										variant={secondaryAction.variant ?? 'outline'}
										type={secondaryAction.type ?? 'button'}
										disabled={secondaryAction.disabled || secondaryAction.isLoading}
										onClick={secondaryAction.onClick}
									>
										{secondaryAction.label}
									</Button>
								) : null}

								{primaryAction ? (
									<Button
										variant={primaryAction.variant ?? 'default'}
										type={primaryAction.type ?? 'button'}
										disabled={primaryAction.disabled || primaryAction.isLoading}
										onClick={primaryAction.onClick}
									>
										{primaryAction.isLoading ? 'Processing…' : primaryAction.label}
									</Button>
								) : null}
							</DialogFooter>
					  )}
			</DialogContent>
		</Dialog>
	);
}

export default GenericModal;


