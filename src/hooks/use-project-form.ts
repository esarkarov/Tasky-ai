import { UseProjectFormParams, UseProjectFormResult } from '@/types/hooks.types';
import { ProjectFormInput } from '@/types/projects.types';
import { useCallback, useMemo, useState } from 'react';

export const useProjectForm = ({ defaultFormData, onSubmit }: UseProjectFormParams): UseProjectFormResult => {
  const [projectName, setProjectName] = useState(defaultFormData.name);
  const [colorName, setColorName] = useState(defaultFormData.color_name);
  const [colorHex, setColorHex] = useState(defaultFormData.color_hex);
  const [aiTaskGen, setAiTaskGen] = useState(false);
  const [taskGenPrompt, setTaskGenPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formData = useMemo<ProjectFormInput>(
    () => ({
      ...defaultFormData,
      name: projectName,
      color_name: colorName,
      color_hex: colorHex,
      ai_task_gen: aiTaskGen,
      task_gen_prompt: taskGenPrompt,
    }),
    [defaultFormData, projectName, colorName, colorHex, aiTaskGen, taskGenPrompt]
  );

  const isDisabled = useMemo(() => {
    const hasName = projectName.trim().length > 0;
    const aiRequirementMet = !aiTaskGen || taskGenPrompt.trim().length > 0;
    return hasName && aiRequirementMet;
  }, [projectName, aiTaskGen, taskGenPrompt]);

  const handleColorSelect = useCallback((value: string) => {
    const [name, hex] = value.split('=');
    setColorName(name);
    setColorHex(hex);
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Project submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSubmit, formData]);

  return {
    projectName,
    colorName,
    colorHex,
    aiTaskGen,
    taskGenPrompt,
    isOpen,
    isSubmitting,
    isDisabled,
    formData,
    setProjectName,
    setAiTaskGen,
    setTaskGenPrompt,
    setIsOpen,
    handleColorSelect,
    handleSubmit,
  };
};
