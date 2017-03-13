import KbnTopNavControllerProvider from 'ui/kbn_top_nav/kbn_top_nav_controller';
import storage from '../storage';

export function SenseTopNavController(Private) {
  const KbnTopNavController = Private(KbnTopNavControllerProvider);

  const controller = new KbnTopNavController([
    {
      key: '欢迎',
//      hideButton: true,
      template: `<sense-welcome></sense-welcome>`,
      testId: 'consoleWelcomeButton',
    },
    {
      key: '历史',
      description: 'history',
      template: `<sense-history></sense-history>`,
      testId: 'consoleHistoryButton',
    },
    {
      key: '设置',
      description: 'settings',
      template: `<sense-settings></sense-settings>`,
      testId: 'consoleSettingsButton',
    },
    {
      key: '帮助',
      description: 'help',
      template: `<sense-help></sense-help>`,
      testId: 'consoleHelpButton',
    },
  ]);

  if (storage.get('version_welcome_shown') !== '@@SENSE_REVISION') {
    controller.open('欢迎')
  }

  return controller
}
