import { Component, OnDestroy } from '@angular/core';
import { DeploymentCenterStateManager } from '../../../wizard-logic/deployment-center-state-manager';
import { Subject } from 'rxjs/Subject';
import { DropDownElement } from '../../../../../../shared/models/drop-down-element';
import { SiteService } from '../../../../../../shared/services/site.service';
import { OsType } from 'app/shared/models/arm/stacks';
import { RegexValidator } from 'app/shared/validators/regexValidator';
import { TranslateService } from '@ngx-translate/core';
import { PortalResources } from 'app/shared/models/portal-resources';

export const TaskRunner = {
  None: 'None',
  Gulp: 'Gulp',
  Grunt: 'Grunt',
};

export const WebAppFramework = {
  AspNetCore: 'AspNetCore',
  Node: 'Node',
  PHP: 'PHP',
  Ruby: 'Ruby',
};

@Component({
  selector: 'app-linux-frameworks',
  templateUrl: './linux-frameworks.component.html',
  styleUrls: [
    './linux-frameworks.component.scss',
    '../../step-configure.component.scss',
    '../../../deployment-center-setup.component.scss',
  ],
})
export class LinuxFramworksComponent implements OnDestroy {
  defaultNodeTaskRunner = 'none';
  nodeJsTaskRunners: DropDownElement<string>[] = [
    { value: 'gulp', displayLabel: 'Gulp' },
    { value: 'grunt', displayLabel: 'Grunt' },
    { value: 'none', displayLabel: 'None' },
  ];

  aspNetCoreVersions: DropDownElement<string>[] = [
    { value: 'gulp', displayLabel: 'Gulp' },
    { value: 'grunt', displayLabel: 'Grunt' },
    { value: 'none', displayLabel: 'None' },
  ];

  webApplicationFrameworks: DropDownElement<string>[] = [
    {
      displayLabel: 'ASP.NET Core',
      value: WebAppFramework.AspNetCore,
    },
    {
      displayLabel: 'Node.JS',
      value: WebAppFramework.Node,
    },
    {
      displayLabel: 'PHP',
      value: WebAppFramework.PHP,
    },
    {
      displayLabel: 'Ruby',
      value: WebAppFramework.Ruby,
    },
  ];
  private _ngUnsubscribe$ = new Subject();

  selectedTaskRunner = this.defaultNodeTaskRunner;
  selectedFramework = '';
  selectedFrameworkVersion = '';
  nodeFrameworkVersions: DropDownElement<string>[] = [];
  dotNetCoreFrameworkVersions: DropDownElement<string>[] = [];
  phpFrameworkVersions: DropDownElement<string>[] = [];
  rubyFrameworkVersions: DropDownElement<string>[] = [];
  constructor(public wizard: DeploymentCenterStateManager, siteService: SiteService, private _translateService: TranslateService) {
    siteService.getAvailableStacks(OsType.Linux).subscribe(vals => {
      const stacks = vals.result.value;
      const rubyStack = stacks.find(x => x.name.toLowerCase() === 'ruby');
      const nodeStack = stacks.find(x => x.name.toLowerCase() === 'node');
      const phpStack = stacks.find(x => x.name.toLowerCase() === 'php');
      const dotNetCoreStack = stacks.find(x => x.name.toLowerCase() === 'dotnetcore');
      this.rubyFrameworkVersions = rubyStack.properties.majorVersions.map(x => {
        return {
          displayLabel: x.displayVersion,
          value: x.runtimeVersion.replace('RUBY|', ''),
        };
      });

      this.phpFrameworkVersions = phpStack.properties.majorVersions.map(x => {
        return {
          displayLabel: x.displayVersion,
          value: x.runtimeVersion.replace('PHP|', ''),
        };
      });

      this.phpFrameworkVersions = phpStack.properties.majorVersions.map(x => {
        return {
          displayLabel: x.displayVersion,
          value: x.runtimeVersion.replace('PHP|', ''),
        };
      });

      this.nodeFrameworkVersions = nodeStack.properties.majorVersions.map(x => {
        return {
          displayLabel: x.displayVersion,
          value: x.runtimeVersion.replace('NODE|', ''),
        };
      });

      this.dotNetCoreFrameworkVersions = dotNetCoreStack.properties.majorVersions.map(x => {
        return {
          displayLabel: x.displayVersion,
          value: x.runtimeVersion.replace('DOTNETCORE|', ''),
        };
      });

      this.wizard.buildSettings
        .get('applicationFramework')
        .valueChanges.takeUntil(this._ngUnsubscribe$)
        .subscribe(val => {
          this.setupValidators(val);
        });
      this.wizard.siteArmObj$.takeUntil(this._ngUnsubscribe$).subscribe(site => {
        const linuxFxVersionObj = site.properties.siteProperties.properties.find(x => x.name === 'LinuxFxVersion');
        if (linuxFxVersionObj) {
          const linuxFxVersion = linuxFxVersionObj.value.split('|');
          const stack = linuxFxVersion[0];
          const version = linuxFxVersion[1];
          this.selectedFramework = stack;
          this.selectedFrameworkVersion = version;
        }
      });
    });
  }

  private setupValidators(stack: string) {
    // Regex value comes from Azure Devops team for validation
    const validator = RegexValidator.create(
      new RegExp('^$|^(node|pm2|ng)\\s+\\w+'),
      this._translateService.instant(PortalResources.invalidStartupCommandNodejs)
    );
    if (stack === WebAppFramework.Node) {
      this.wizard.buildSettings.get('startupCommand').setValidators([validator]);
      this.wizard.buildSettings.get('startupCommand').updateValueAndValidity();
    } else {
      this.removeValidators();
    }
  }

  private removeValidators() {
    this.wizard.buildSettings.get('startupCommand').setValidators([]);
    this.wizard.buildSettings.get('startupCommand').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this.removeValidators();
  }
}
